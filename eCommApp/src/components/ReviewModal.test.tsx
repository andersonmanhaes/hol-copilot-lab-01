import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 2.5,
    reviews: [],
    inStock: true
};

describe('ReviewModal', () => {
    it('renders nothing when no product is selected', () => {
        const { container } = render(<ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />);

        expect(container).toBeEmptyDOMElement();
    });

    it('shows an empty state when the product has no reviews', () => {
        render(<ReviewModal product={product} onClose={vi.fn()} onSubmit={vi.fn()} />);

        expect(screen.getByRole('heading', { name: 'Reviews for Apple' })).toBeInTheDocument();
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('renders existing reviews', () => {
        render(
            <ReviewModal
                product={{ ...product, reviews: [{ author: 'Sam', comment: 'Fresh fruit', date: '2025-01-02T00:00:00.000Z' }] }}
                onClose={vi.fn()}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByText('Sam')).toBeInTheDocument();
        expect(screen.getByText('Fresh fruit')).toBeInTheDocument();
        expect(screen.queryByText('No reviews yet.')).not.toBeInTheDocument();
    });

    it('submits the author and comment and resets the form', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<ReviewModal product={product} onClose={vi.fn()} onSubmit={onSubmit} />);

        await user.type(screen.getByPlaceholderText('Your name'), 'Taylor');
        await user.type(screen.getByPlaceholderText('Your review'), 'Excellent');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({ author: 'Taylor', comment: 'Excellent' });
        expect(onSubmit.mock.calls[0][0].date).toEqual(expect.any(String));
        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your review')).toHaveValue('');
    });

    it('closes when the close button or backdrop is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const { container } = render(<ReviewModal product={product} onClose={onClose} onSubmit={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: 'Close' }));
        await user.click(container.querySelector('.modal-backdrop') as HTMLElement);

        expect(onClose).toHaveBeenCalledTimes(2);
    });
});
