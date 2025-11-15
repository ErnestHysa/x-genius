import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContentGenerator } from './ContentGenerator';

describe('ContentGenerator', () => {
    it('disables the submit button when the tweet count is empty', async () => {
        const user = userEvent.setup();
        const handleGenerate = vi.fn();
        render(<ContentGenerator onGenerate={handleGenerate} isLoading={false} />);

        const tweetCountInput = screen.getByLabelText('Number of Tweets');
        const submitButton = screen.getByRole('button', { name: /generate content/i });

        // Clear the input
        await user.clear(tweetCountInput);

        expect(submitButton).toBeDisabled();
    });

    it('disables the submit button when the tweet count is invalid', async () => {
        const handleGenerate = vi.fn();
        render(<ContentGenerator onGenerate={handleGenerate} isLoading={false} />);

        const tweetCountInput = screen.getByLabelText('Number of Tweets');
        const submitButton = screen.getByRole('button', { name: /generate content/i });

        // Test with a value greater than the maximum allowed
        fireEvent.change(tweetCountInput, { target: { value: '11' } });
        expect(submitButton).toBeDisabled();

        // Test with a value less than the minimum allowed
        fireEvent.change(tweetCountInput, { target: { value: '0' } });
        expect(submitButton).toBeDisabled();
    });

    it('ignores non-numeric input for the tweet count', () => {
        const handleGenerate = vi.fn();
        render(<ContentGenerator onGenerate={handleGenerate} isLoading={false} />);

        const tweetCountInput = screen.getByLabelText('Number of Tweets') as HTMLInputElement;

        // Test with a non-numeric value
        fireEvent.change(tweetCountInput, { target: { value: 'abc' } });
        expect(tweetCountInput.value).toBe('3'); // It should retain the initial value
      });
});
