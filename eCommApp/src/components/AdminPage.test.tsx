import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage';

vi.mock('./Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('./Footer', () => ({ default: () => <div data-testid="footer" /> }));

const renderPage = () => render(<MemoryRouter><AdminPage /></MemoryRouter>);

describe('AdminPage', () => {
    it('starts with no active sale', () => {
        renderPage();

        expect(screen.getByText('Welcome to the admin portal.')).toBeInTheDocument();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('activates a sale for a valid percentage', async () => {
        const user = userEvent.setup();
        renderPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        await user.clear(input);
        await user.type(input, '25');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
    });

    it('shows an error for non-numeric input', async () => {
        const user = userEvent.setup();
        renderPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        await user.clear(input);
        await user.type(input, 'invalid');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        expect(screen.getByText(/Please enter a valid number/)).toBeInTheDocument();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('ends an active sale and resets the input', async () => {
        const user = userEvent.setup();
        renderPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        await user.clear(input);
        await user.type(input, '15');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        await user.click(screen.getByRole('button', { name: 'End Sale' }));

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(input).toHaveValue('0');
    });
});
