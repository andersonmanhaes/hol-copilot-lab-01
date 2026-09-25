import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({
        onConfirm,
        onCancel
    }: {
        onConfirm: () => void;
        onCancel: () => void;
    }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm}>Confirm checkout</button>
            <button onClick={onCancel}>Cancel checkout</button>
        </div>
    )
}));

const createCartItem = (
    overrides: Partial<CartItem> = {}
): CartItem => ({
    id: 'product-1',
    name: 'Test Product',
    price: 29.99,
    quantity: 2,
    image: 'test-product.jpg',
    reviews: [],
    inStock: true,
    ...overrides
});

const createCartContext = (
    cartItems: CartItem[] = [createCartItem()]
) => ({
    cartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
});

const renderWithCartContext = (
    cartContext = createCartContext()
) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the cart title and shared layout', () => {
        renderWithCartContext();

        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders all products in the cart', () => {
        const items = [
            createCartItem({
                id: 'apple',
                name: 'Apple',
                price: 2.5,
                quantity: 3
            }),
            createCartItem({
                id: 'pear',
                name: 'Pear',
                price: 4.75,
                quantity: 1
            })
        ];

        renderWithCartContext(createCartContext(items));

        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Pear')).toBeInTheDocument();
        expect(screen.getByText('Price: $2.50')).toBeInTheDocument();
        expect(screen.getByText('Price: $4.75')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 3')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('renders an empty-cart message when there are no items', () => {
        renderWithCartContext(createCartContext([]));

        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Checkout' }))
            .not.toBeInTheDocument();
    });

    it('does not open checkout when the cart is empty', () => {
        const user = userEvent.setup();

        renderWithCartContext(createCartContext([]));

        expect(
            screen.queryByTestId('checkout-modal')
        ).not.toBeInTheDocument();

        expect(user).toBeDefined();
    });

    it('opens the checkout modal when Checkout is clicked', async () => {
        const user = userEvent.setup();

        renderWithCartContext();

        await user.click(screen.getByRole('button', { name: 'Checkout' }));

        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        expect(screen.getByText('Confirm checkout')).toBeInTheDocument();
        expect(screen.getByText('Cancel checkout')).toBeInTheDocument();
    });

    it('does not clear the cart before checkout is confirmed', async () => {
        const user = userEvent.setup();
        const cartContext = createCartContext();

        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));

        expect(cartContext.clearCart).not.toHaveBeenCalled();
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
    });

    it('closes the checkout modal when checkout is cancelled', async () => {
        const user = userEvent.setup();

        renderWithCartContext();

        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(
            screen.getByRole('button', { name: 'Cancel checkout' })
        );

        expect(
            screen.queryByTestId('checkout-modal')
        ).not.toBeInTheDocument();
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
    });

    it('processes the order after checkout confirmation', async () => {
        const user = userEvent.setup();
        const items = [
            createCartItem({
                id: 'apple',
                name: 'Apple',
                price: 1.99,
                quantity: 4
            })
        ];
        const cartContext = createCartContext(items);

        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(
            screen.getByRole('button', { name: 'Confirm checkout' })
        );

        expect(cartContext.clearCart).toHaveBeenCalledTimes(1);
        expect(
            screen.getByText('Your order has been processed!')
        ).toBeInTheDocument();
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Price: $1.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 4')).toBeInTheDocument();
        expect(
            screen.queryByTestId('checkout-modal')
        ).not.toBeInTheDocument();
    });

    it('preserves the processed items after clearing the cart', async () => {
        const user = userEvent.setup();
        const items = [
            createCartItem({
                name: 'Processed Product',
                quantity: 7
            })
        ];
        const cartContext = createCartContext(items);

        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(
            screen.getByRole('button', { name: 'Confirm checkout' })
        );

        expect(cartContext.clearCart).toHaveBeenCalled();
        expect(screen.getByText('Processed Product')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 7')).toBeInTheDocument();
    });

    it('renders zero-priced products correctly', () => {
        const item = createCartItem({
            price: 0,
            quantity: 1,
            name: 'Free Product'
        });

        renderWithCartContext(createCartContext([item]));

        expect(screen.getByText('Price: $0.00')).toBeInTheDocument();
        expect(screen.getByText('Free Product')).toBeInTheDocument();
    });

    it('renders products with zero quantity without crashing', () => {
        const item = createCartItem({
            quantity: 0,
            name: 'Zero Quantity Product'
        });

        renderWithCartContext(createCartContext([item]));

        expect(
            screen.getByText('Quantity: 0')
        ).toBeInTheDocument();
    });

    it('renders products with a negative quantity without crashing', () => {
        const item = createCartItem({
            quantity: -1,
            name: 'Invalid Quantity Product'
        });

        renderWithCartContext(createCartContext([item]));

        expect(
            screen.getByText('Quantity: -1')
        ).toBeInTheDocument();
    });

    it('throws when rendered without CartProvider', () => {
        expect(() => render(<CartPage />)).toThrow(
            'CartContext must be used within a CartProvider'
        );
    });
});
