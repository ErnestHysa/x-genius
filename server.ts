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

/**
 * @property {object} tokenStore - In-memory store for OAuth token secrets.
 * @property {string} oauth_token_secret - The OAuth token secret from Twitter.
 * @property {string} [access_token] - The access token from Twitter.
 * @property {string} [access_secret] - The access secret from Twitter.
 */
const tokenStore: { [key: string]: { oauth_token_secret: string, access_token?: string, access_secret?: string } } = {};

app.use(cors());
app.use(bodyParser.json());

/**
 * @property {sqlite.Database} db - The SQLite database connection.
 */
let db;
(async () => {
    db = await open({
        filename: './app.db',
        driver: sqlite3.Database
    });
    await db.exec('CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY, accessToken TEXT, accessSecret TEXT)');
})();

/**
 * The Twitter API client.
 * @type {TwitterApi}
 */
const twitterClient = new TwitterApi({
  appKey: process.env.VITE_X_CONSUMER_KEY || '',
  appSecret: process.env.VITE_X_CONSUMER_SECRET || '',
});

/**
 * Route to generate a Twitter authentication link.
 * @name post/api/auth/request_token
 * @function
 * @memberof module:server
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} 200 - JSON object with the authentication URL.
 * @returns {object} 500 - JSON object with an error message.
 */
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

/**
 * Route to handle the callback from Twitter after authentication.
 * @name post/api/auth/callback
 * @function
 * @memberof module:server
 * @inner
 * @param {object} req - Express request object.
 * @param {string} req.body.oauth_token - The OAuth token from Twitter.
 * @param {string} req.body.oauth_verifier - The OAuth verifier from Twitter.
 * @param {object} res - Express response object.
 * @returns {object} 200 - JSON object with the access token and secret.
 * @returns {object} 400 - JSON object with an error message.
 * @returns {object} 500 - JSON object with an error message.
 */
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

/**
 * Route to get the access token from the database.
 * @name get/api/auth/token
 * @function
 * @memberof module:server
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} 200 - JSON object with the access token and secret.
 * @returns {object} 404 - JSON object with an error message.
 * @returns {object} 500 - JSON object with an error message.
 */
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

/**
 * Route to log the user out by deleting the access token from the database.
 * @name post/api/auth/logout
 * @function
 * @memberof module:server
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} 200 - JSON object with a success message.
 * @returns {object} 500 - JSON object with an error message.
 */
app.post('/api/auth/logout', async (req, res) => {
    try {
        await db.run('DELETE FROM tokens WHERE id = ?', 1);
        res.json({ success: true });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Could not log out.' });
    }
});

/**
 * Route to post a tweet thread to Twitter.
 * @name post/api/post_tweet
 * @function
 * @memberof module:server
 * @inner
 * @param {object} req - Express request object.
 * @param {string[]} req.body.thread - An array of strings, where each string is a tweet in the thread.
 * @param {string} req.body.accessToken - The user's Twitter access token.
 * @param {string} req.body.accessSecret - The user's Twitter access secret.
 * @param {object} res - Express response object.
 * @returns {object} 200 - JSON object with a success message.
 * @returns {object} 400 - JSON object with an error message.
 * @returns {object} 500 - JSON object with an error message.
 */
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


/**
 * Starts the Express server.
 * @function
 * @memberof module:server
 * @inner
 * @param {number} port - The port to listen on.
 * @param {Function} callback - The function to call once the server is running.
 */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
