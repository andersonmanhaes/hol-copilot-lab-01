import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ContactModal from './ContactModal';

describe('ContactModal', () => {
    it('renders the contact form fields', () => {
        render(<ContactModal onClose={vi.fn()} />);

        expect(screen.getByRole('dialog', { name: 'Contact Us' })).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toHaveFocus();
        expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
        expect(screen.getByLabelText('Request')).toBeInTheDocument();
    });

    it('shows the success message and removes submitted entries', async () => {
        const user = userEvent.setup();
        render(<ContactModal onClose={vi.fn()} />);

        await user.type(screen.getByLabelText('Name'), 'Taylor');
        await user.type(screen.getByLabelText('Email'), 'taylor@example.com');
        await user.type(screen.getByLabelText('Request'), 'Please contact me.');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('Thank you for your message.')).toBeInTheDocument();
        expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Request')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('closes after Continue is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<ContactModal onClose={onClose} />);

        await user.type(screen.getByLabelText('Name'), 'Taylor');
        await user.type(screen.getByLabelText('Email'), 'taylor@example.com');
        await user.type(screen.getByLabelText('Request'), 'Please contact me.');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});