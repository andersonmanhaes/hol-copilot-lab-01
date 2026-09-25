import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProductsPage from './ProductsPage';
import { CartContext } from '../context/CartContext';
import { Product, Review } from '../types';

vi.mock('./Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('./Footer', () => ({ default: () => <div data-testid="footer" /> }));
vi.mock('./ReviewModal', () => ({
    default: ({ product, onClose, onSubmit }: { product: Product | null; onClose: () => void; onSubmit: (review: Review) => void }) => product ? (
        <div data-testid="review-modal">
            <span>{product.reviews.length} reviews</span>
            <button onClick={() => onSubmit({ author: 'Reviewer', comment: 'Great', date: '2025-01-01T00:00:00.000Z' })}>Submit review</button>
            <button onClick={onClose}>Close review</button>
        </div>
    ) : null
}));

const products: Product[] = [
    { id: 'apple', name: 'Apple', price: 2.5, description: 'Crisp apple', image: 'apple.jpg', reviews: [], inStock: true },
    { id: 'grapes', name: 'Grapes', price: 4, image: 'grapes.jpg', reviews: [], inStock: false }
];

const createResponse = (product: Product): Response => ({
    ok: true,
    json: async () => product
} as Response);

const renderPage = (addToCart = vi.fn()) => render(
    <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
        <ProductsPage />
    </CartContext.Provider>
);

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.stubGlobal('fetch', vi.fn((url: string) => {
            const product = url.includes('apple') ? products[0] : url.includes('grapes') ? products[1] : {
                ...products[0], id: url, name: url.includes('orange') ? 'Orange' : 'Pear'
            };
            return Promise.resolve(createResponse(product));
        }));
    });

    it('shows loading state before products finish loading', () => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => undefined)));
        renderPage();

        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('loads and displays product details', async () => {
        renderPage();

        expect(await screen.findByText('Our Products')).toBeInTheDocument();
        const appleCard = screen.getByRole('img', { name: 'Apple' }).closest('.product-card');
        expect(appleCard).not.toBeNull();
        expect(within(appleCard as HTMLElement).getByText('Apple')).toBeInTheDocument();
        expect(within(appleCard as HTMLElement).getByText('$2.50')).toBeInTheDocument();
        expect(within(appleCard as HTMLElement).getByText('Crisp apple')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Apple' })).toHaveAttribute('src', 'products/productImages/apple.jpg');
        expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
    });

    it('adds an in-stock product to the cart', async () => {
        const user = userEvent.setup();
        const addToCart = vi.fn();
        renderPage(addToCart);

        await screen.findByText('Apple');
        const appleCard = screen.getByRole('img', { name: 'Apple' }).closest('.product-card');
        await user.click(within(appleCard as HTMLElement).getByRole('button', { name: 'Add to Cart' }));

        expect(addToCart).toHaveBeenCalledWith(products[0]);
    });

    it('handles a product loading failure and leaves an empty catalog', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network failure'))));
        renderPage();

        await waitFor(() => expect(screen.queryByText('Loading products...')).not.toBeInTheDocument());
        expect(screen.getByText('Our Products')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Add to Cart' })).not.toBeInTheDocument();
    });

    it('opens the review modal and prepends a submitted review', async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(await screen.findByRole('img', { name: 'Apple' }));
        expect(screen.getByTestId('review-modal')).toBeInTheDocument();
        expect(screen.getByText('0 reviews')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Submit review' }));

        expect(screen.getByText('1 reviews')).toBeInTheDocument();
    });

    it('closes the review modal', async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(await screen.findByRole('img', { name: 'Apple' }));
        await user.click(screen.getByRole('button', { name: 'Close review' }));

        expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();
    });
});
