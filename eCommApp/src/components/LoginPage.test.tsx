import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';

vi.mock('./Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('./Footer', () => ({ default: () => <div data-testid="footer" /> }));

const LocationProbe = () => {
    const location = useLocation();
    return <output data-testid="location">{location.pathname}</output>;
};

const renderPage = (withLocationProbe = false) => render(
    <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
        {withLocationProbe && <LocationProbe />}
    </MemoryRouter>
);

describe('LoginPage', () => {
    it('renders the admin login form', () => {
        renderPage();

        expect(screen.getByRole('heading', { name: 'Admin Login' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toHaveFocus();
        expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    });

    it('shows an error for invalid credentials', async () => {
        const user = userEvent.setup();
        renderPage();

        await user.type(screen.getByPlaceholderText('Username'), 'someone');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('navigates to the admin page and clears credentials on valid login', async () => {
        const user = userEvent.setup();
        renderPage(true);

        const username = screen.getByPlaceholderText('Username');
        const password = screen.getByPlaceholderText('Password');
        await user.type(username, 'admin');
        await user.type(password, 'admin');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByTestId('location')).toHaveTextContent('/admin');
        expect(username).toHaveValue('');
        expect(password).toHaveValue('');
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
});
