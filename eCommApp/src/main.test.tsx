import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./App.tsx', () => ({ default: () => <div>mock application</div> }));

describe('main entry point', () => {
    it('mounts the application into the root element', async () => {
        document.body.innerHTML = '<div id="root"></div>';

        await import('./main');

        await waitFor(() => {
            expect(screen.getByText('mock application')).toBeInTheDocument();
        });
    });
});
