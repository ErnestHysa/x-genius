<div align="center">
<img width="1200" height="475" alt="X-Genius Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# X-Genius: AI-Powered Tweet Thread Generator

X-Genius is a web application designed to help you effortlessly create and post engaging tweet threads to X (formerly Twitter). Simply provide a topic, and our AI, powered by [OpenRouter](https://openrouter.ai/), will generate a complete thread for you.

## ✨ Features

-   **AI-Powered Content:** Generate high-quality, contextual tweet threads from a simple prompt.
-   **Flexible Models:** Use any language model available on OpenRouter by providing your API key and a model ID.
-   **Direct Posting:** Post the generated thread directly to your X account with a single click.
-   **Local First:** The entire application runs locally, with no need for an online database or backend service.
-   **Secure Storage:** Your API keys are stored securely in a local `.env` file and a local SQLite database.

## 🛠️ Tech Stack

-   **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Backend:** [Express.js](https://expressjs.com/)
-   **Database:** [SQLite](https://www.sqlite.org/index.html)
-   **AI Integration:** [OpenRouter](https://openrouter.ai/)

## 🚀 Getting Started

Follow these instructions to set up and run the project locally for development.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) (or yarn/pnpm)
-   An [X Developer](https://developer.twitter.com/) account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/x-genius.git
cd x-genius
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Environment Variables

1.  Create a file named `.env` in the root of the project.
2.  Add the following environment variables to the `.env` file:

```
VITE_X_CONSUMER_KEY=your_twitter_consumer_key
VITE_X_CONSUMER_SECRET=your_twitter_consumer_secret
```

Replace `your_twitter_consumer_key` and `your_twitter_consumer_secret` with the values from your X Developer App.

### 4. Run the Application

Once the setup is complete, you can run the local development server:

```bash
npm run dev
```

This will start both the frontend and backend servers. The application should now be running at `http://localhost:3000`.

## ⚙️ Configuration & Usage

1.  **Log In:** Click the login button to authenticate with your X account.
2.  **Configure OpenRouter:**
    -   Open the **Settings** panel.
    -   Enter your **OpenRouter API Key**. You can get one from the [OpenRouter website](https://openrouter.ai/keys).
    -   (Optional) Change the **Model ID** to use a different model. The default is `openai/gpt-3.5-turbo`.
3.  **Generate Content:**
    -   In the main panel, enter a topic or prompt for your thread.
    -   Select the desired number of tweets.
    -   Click **"Generate Content"**.
4.  **Post to X:**
    -   Review the generated thread.
    -   If you're satisfied, click **"Post Thread to X"**.

## ⚠️ Security Note

Your OpenRouter API key is stored only in your browser's local storage. Your Twitter API keys are stored in a local `.env` file and your access tokens are stored in a local SQLite database. For maximum security, it is recommended to use this tool on a private computer.
