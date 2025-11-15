import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { TwitterApi } from 'twitter-api-v2';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

const tokenStore: { [key: string]: { oauth_token_secret: string, access_token?: string, access_secret?: string } } = {};

app.use(cors());
app.use(bodyParser.json());

// Database initialization
let db;
(async () => {
    db = await open({
        filename: './app.db',
        driver: sqlite3.Database
    });
    await db.exec('CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY, accessToken TEXT, accessSecret TEXT)');
})();

const twitterClient = new TwitterApi({
  appKey: process.env.VITE_X_CONSUMER_KEY || '',
  appSecret: process.env.VITE_X_CONSUMER_SECRET || '',
});

app.post('/api/auth/request_token', async (req, res) => {
  try {
    const authLink = await twitterClient.generateAuthLink('http://localhost:3000/callback');

    if (authLink && authLink.oauth_token) {
        tokenStore[authLink.oauth_token] = {
            oauth_token_secret: authLink.oauth_token_secret,
        };
        res.json({ auth_url: authLink.url });
    } else {
        res.status(500).json({ error: 'Could not generate authentication link.' });
    }
  } catch (error) {
    console.error('Error getting request token:', error);
    res.status(500).json({ error: 'Could not get request token from Twitter.' });
  }
});

app.post('/api/auth/callback', async (req, res) => {
    const { oauth_token, oauth_verifier } = req.body;

    if (!oauth_token || !oauth_verifier) {
        return res.status(400).json({ error: 'oauth_token and oauth_verifier are required.' });
    }

    const tokenData = tokenStore[oauth_token];
    if (!tokenData) {
        return res.status(400).json({ error: 'Invalid or expired oauth_token.' });
    }

    const client = new TwitterApi({
        appKey: process.env.VITE_X_CONSUMER_KEY || '',
        appSecret: process.env.VITE_X_CONSUMER_SECRET || '',
        accessToken: oauth_token,
        accessSecret: tokenData.oauth_token_secret,
    });

    try {
        const { accessToken, accessSecret } = await client.login(oauth_verifier);
        await db.run('INSERT OR REPLACE INTO tokens (id, accessToken, accessSecret) VALUES (?, ?, ?)', 1, accessToken, accessSecret);
        res.json({ accessToken, accessSecret });
    } catch (error) {
        console.error('Error getting access token:', error);
        res.status(500).json({ error: 'Could not get access token from Twitter.' });
    }
});

app.get('/api/auth/token', async (req, res) => {
    try {
        const token = await db.get('SELECT accessToken, accessSecret FROM tokens WHERE id = ?', 1);
        if (token) {
            res.json(token);
        } else {
            res.status(404).json({ error: 'Token not found' });
        }
    } catch (error) {
        console.error('Error getting token:', error);
        res.status(500).json({ error: 'Could not get token from database.' });
    }
});

app.post('/api/auth/logout', async (req, res) => {
    try {
        await db.run('DELETE FROM tokens WHERE id = ?', 1);
        res.json({ success: true });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Could not log out.' });
    }
});

app.post('/api/post_tweet', async (req, res) => {
    const { thread, accessToken, accessSecret } = req.body;

    if (!thread || !accessToken || !accessSecret) {
        return res.status(400).json({ error: 'thread, accessToken, and accessSecret are required.' });
    }

    const client = new TwitterApi({
        appKey: process.env.VITE_X_CONSUMER_KEY || '',
        appSecret: process.env.VITE_X_CONSUMER_SECRET || '',
        accessToken: accessToken,
        accessSecret: accessSecret,
    });

    try {
        let previousTweetId: string | undefined = undefined;
        for (const tweetText of thread) {
            const result = await client.v2.tweet(tweetText, {
                reply: previousTweetId ? { in_reply_to_tweet_id: previousTweetId } : undefined,
            });
            previousTweetId = result.data.id;
        }
        res.json({ success: true, message: 'Thread posted successfully.' });
    } catch (error) {
        console.error('Error posting tweet:', error);
        res.status(500).json({ error: 'Could not post tweet to Twitter.' });
    }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
