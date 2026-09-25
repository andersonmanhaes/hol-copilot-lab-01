import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import { Product } from '../types';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 2.5,
    image: 'apple.jpg',
    reviews: [],
    inStock: true
};

const CartConsumer = () => {
    const context = CartContext;
    return (
        <CartContext.Consumer>
            {value => (
                <>
                    <output data-testid="count">{value?.cartItems.length ?? 'missing'}</output>
                    <output data-testid="quantity">{value?.cartItems[0]?.quantity ?? 0}</output>
                    <button onClick={() => value?.addToCart(product)}>Add</button>
                    <button onClick={() => value?.clearCart()}>Clear</button>
                    <span data-testid="context-defined">{context ? 'defined' : 'missing'}</span>
                </>
            )}
        </CartContext.Consumer>
    );
};

describe('CartProvider', () => {
    it('starts with an empty cart', () => {
        render(<CartProvider><CartConsumer /></CartProvider>);

        expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    it('adds a new product with quantity one', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByRole('button', { name: 'Add' }));

        expect(screen.getByTestId('count')).toHaveTextContent('1');
        expect(screen.getByTestId('quantity')).toHaveTextContent('1');
    });

    it('increments the quantity when the same product is added again', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByRole('button', { name: 'Add' }));
        await user.click(screen.getByRole('button', { name: 'Add' }));

        expect(screen.getByTestId('count')).toHaveTextContent('1');
        expect(screen.getByTestId('quantity')).toHaveTextContent('2');
    });

    it('clears all products', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByRole('button', { name: 'Add' }));
        await user.click(screen.getByRole('button', { name: 'Clear' }));

        expect(screen.getByTestId('count')).toHaveTextContent('0');
        expect(screen.getByTestId('quantity')).toHaveTextContent('0');
    });
});
