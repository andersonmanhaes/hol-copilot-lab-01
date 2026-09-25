import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('./components/HomePage', () => ({ default: () => <div>home route</div> }));
vi.mock('./components/ProductsPage', () => ({ default: () => <div>products route</div> }));
vi.mock('./components/LoginPage', () => ({ default: () => <div>login route</div> }));
vi.mock('./components/AdminPage', () => ({ default: () => <div>admin route</div> }));
vi.mock('./components/CartPage', () => ({ default: () => <div>cart route</div> }));

describe('App routing', () => {
    it.each([
        ['/', 'home route'],
        ['/products', 'products route'],
        ['/login', 'login route'],
        ['/admin', 'admin route'],
        ['/cart', 'cart route']
    ])('renders the page for %s', (route, pageText) => {
        render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);

        expect(screen.getByText(pageText)).toBeInTheDocument();
    });
});
