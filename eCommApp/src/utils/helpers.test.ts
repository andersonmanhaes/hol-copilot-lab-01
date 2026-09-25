import { describe, expect, it } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('helpers', () => {
    describe('formatPrice', () => {
        it('formats positive prices as US currency', () => {
            expect(formatPrice(12.5)).toBe('$12.50');
        });

        it('formats zero and negative values consistently', () => {
            expect(formatPrice(0)).toBe('$0.00');
            expect(formatPrice(-3.2)).toBe('-$3.20');
        });
    });

    describe('calculateTotal', () => {
        it('calculates the total for multiple items', () => {
            expect(calculateTotal([
                { price: 2.5, quantity: 2 },
                { price: 10, quantity: 1 }
            ])).toBe(15);
        });

        it('returns zero for an empty cart', () => {
            expect(calculateTotal([])).toBe(0);
        });

        it('supports zero and fractional quantities', () => {
            expect(calculateTotal([
                { price: 10, quantity: 0 },
                { price: 2.5, quantity: 0.5 }
            ])).toBe(1.25);
        });
    });

    describe('validateEmail', () => {
        it.each(['person@example.com', 'name+tag@example.co.uk'])('accepts %s', email => {
            expect(validateEmail(email)).toBe(true);
        });

        it.each(['', 'person', 'person@', '@example.com', 'person@example'])('rejects %s', email => {
            expect(validateEmail(email)).toBe(false);
        });
    });
});
