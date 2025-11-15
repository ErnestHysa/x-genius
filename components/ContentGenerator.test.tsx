import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContentGenerator from './ContentGenerator';
import * as authService from '../services/authService';
import * as xService from '../services/xService';
import * as openRouterService from '../services/openRouterService';

vi.mock('../services/authService');
vi.mock('../services/xService');
vi.mock('../services/openRouterService');

describe('ContentGenerator', () => {
    const onLogout = vi.fn();

    it('renders the main UI elements', () => {
        render(<ContentGenerator onLogout={onLogout} />);
        expect(screen.getByPlaceholderText('Enter a topic for your X thread...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /generate thread/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('calls generateContent when the generate button is clicked', async () => {
        const user = userEvent.setup();
        (openRouterService.generateContent as any).mockResolvedValue(['tweet1', 'tweet2']);
        render(<ContentGenerator onLogout={onLogout} />);

        const topicInput = screen.getByPlaceholderText('Enter a topic for your X thread...');
        const generateButton = screen.getByRole('button', { name: /generate thread/i });

        await user.type(topicInput, 'test topic');
        await user.click(generateButton);

        // We can't easily test the arguments here because some of them come from local storage.
        // Instead, we'll just check that the function was called.
        expect(openRouterService.generateContent).toHaveBeenCalled();
    });

    it('displays the generated thread and post button', async () => {
        const user = userEvent.setup();
        (openRouterService.generateContent as any).mockResolvedValue(['tweet1', 'tweet2']);
        render(<ContentGenerator onLogout={onLogout} />);

        const topicInput = screen.getByPlaceholderText('Enter a topic for your X thread...');
        const generateButton = screen.getByRole('button', { name: /generate thread/i });

        await user.type(topicInput, 'test topic');
        await user.click(generateButton);

        expect(await screen.findByText('tweet1')).toBeInTheDocument();
        expect(screen.getByText('tweet2')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /post to x/i })).toBeInTheDocument();
    });

    it('calls postToX when the post button is clicked', async () => {
        const user = userEvent.setup();
        (openRouterService.generateContent as any).mockResolvedValue(['tweet1', 'tweet2']);
        (authService.getAccessToken as any).mockResolvedValue({ accessToken: 'test-token', accessSecret: 'test-secret' });
        (xService.postToX as any).mockResolvedValue({ success: true });
        render(<ContentGenerator onLogout={onLogout} />);

        // First, generate the thread
        const topicInput = screen.getByPlaceholderText('Enter a topic for your X thread...');
        const generateButton = screen.getByRole('button', { name: /generate thread/i });
        await user.type(topicInput, 'test topic');
        await user.click(generateButton);

        // Then, post it
        const postButton = await screen.findByRole('button', { name: /post to x/i });
        await user.click(postButton);

        expect(xService.postToX).toHaveBeenCalledWith(['tweet1', 'tweet2'], 'test-token', 'test-secret');
    });

    it('calls onLogout when the logout button is clicked', async () => {
        const user = userEvent.setup();
        render(<ContentGenerator onLogout={onLogout} />);
        const logoutButton = screen.getByRole('button', { name: /logout/i });
        await user.click(logoutButton);
        expect(onLogout).toHaveBeenCalled();
    });
});
