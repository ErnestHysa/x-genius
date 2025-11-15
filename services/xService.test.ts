import { describe, it, expect, vi } from 'vitest';
import { postToX } from './xService';
import { supabase } from './supabaseClient';

vi.mock('./supabaseClient', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('xService', () => {
  it('successfully posts a thread', async () => {
    (supabase.functions.invoke as any).mockResolvedValue({
      data: { message: 'Successfully posted.' },
      error: null,
    });

    const result = await postToX(['tweet1'], 'test-token');
    expect(result).toEqual({ success: true, message: 'Successfully posted.' });
  });

  it('throws an error if the provider token is missing', async () => {
    await expect(postToX(['tweet1'], '')).rejects.toThrow('Authentication token is missing. Please log in again.');
  });

  it('throws an error if the thread is empty', async () => {
    await expect(postToX([], 'test-token')).rejects.toThrow('Cannot post empty content.');
  });

  it('handles errors from the edge function', async () => {
    (supabase.functions.invoke as any).mockResolvedValue({
      data: null,
      error: { message: 'Edge function error' },
    });

    await expect(postToX(['tweet1'], 'test-token')).rejects.toThrow('Edge function error');
  });

  it('handles detailed errors from the edge function context', async () => {
    (supabase.functions.invoke as any).mockResolvedValue({
        data: null,
        error: { context: { error: 'A detailed error message.' } },
    });

    await expect(postToX(['tweet1'], 'test-token')).rejects.toThrow('A detailed error message.');
  });
});
