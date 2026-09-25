import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import { MemoryRouter } from 'react-router-dom';

describe('Header', () => {
    it('renders the brand and navigation links', () => {
        render(<MemoryRouter><Header /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: 'The Daily Harvest' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
        expect(screen.getByRole('button', { name: 'Admin Login' })).toBeInTheDocument();
    });
});

describe('Footer', () => {
    it('renders the copyright notice', () => {
        render(<Footer />);

        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });
});

describe('HomePage', () => {
    it('renders the welcome message and store prompt', () => {
        render(<MemoryRouter><HomePage /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: 'Welcome to the The Daily Harvest!' })).toBeInTheDocument();
        expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
    });
});
