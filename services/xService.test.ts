import { describe, it, expect, vi } from 'vitest';
import { postToX } from './xService';

// Mock the global fetch function
global.fetch = vi.fn();

describe('xService', () => {
    it('successfully posts a thread', async () => {
        (fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ success: true, message: 'Successfully posted.' }),
        });

        const result = await postToX(['tweet1'], 'test-token', 'test-secret');
        expect(result).toEqual({ success: true, message: 'Successfully posted.' });
    });

    it('throws an error if the thread is empty', async () => {
        await expect(postToX([], 'test-token', 'test-secret')).rejects.toThrow('Cannot post empty content.');
    });

    it('handles errors from the API', async () => {
        (fetch as any).mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({ error: 'API error' }),
        });

        await expect(postToX(['tweet1'], 'test-token', 'test-secret')).rejects.toThrow('API error');
    });

    it('handles unknown errors from the API', async () => {
        (fetch as any).mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({}),
        });

        await expect(postToX(['tweet1'], 'test-token', 'test-secret')).rejects.toThrow('An unknown error occurred while posting to X.');
    });
});
