<div align="center">
<img width="1200" height="475" alt="X-Genius Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# X-Genius: AI-Powered Tweet Thread Generator

X-Genius is a web application designed to help you effortlessly create and post engaging tweet threads to X (formerly Twitter). Simply provide a topic, and our AI, powered by [OpenRouter](https://openrouter.ai/), will generate a complete thread for you.

## ✨ Features

-   **AI-Powered Content:** Generate high-quality, contextual tweet threads from a simple prompt.
-   **Flexible Models:** Use any language model available on OpenRouter by providing your API key and a model ID.
-   **Direct Posting:** Post the generated thread directly to your X account with a single click.
-   **Secure Authentication:** Uses Supabase for secure OAuth 2.0 authentication with X.
-   **Local Storage:** Your API keys are stored securely in your browser's local storage and are never sent to our servers.

## 🛠️ Tech Stack

-   **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Backend & Auth:** [Supabase](https://supabase.com/) (Auth, Edge Functions)
-   **AI Integration:** [OpenRouter](https://openrouter.ai/)

## 🚀 Getting Started

Follow these instructions to set up and run the project locally for development.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) (or yarn/pnpm)
-   A [Supabase](https://supabase.com/) account
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

### 3. Set up Supabase

1.  **Create a Supabase Project:**
    -   Go to the [Supabase Dashboard](https://app.supabase.com/) and create a new project.
    -   Save your **Project URL** and **`anon` public key**.

2.  **Configure Supabase Client:**
    -   Open the file `services/supabaseClient.ts`.
    -   Replace the placeholder `supabaseUrl` and `supabaseAnonKey` with the values from your project.

3.  **Configure X (Twitter) Authentication:**
    -   In your Supabase project, navigate to **Authentication** > **Providers**.
    -   Enable **Twitter** as a provider.
    -   You will need to get a **Client ID** and **Client Secret** from your X Developer App.
    -   For the **Redirect URL** (also known as Callback URL), add `http://localhost:5173`. The default port for Vite is 5173.

### 4. Deploy the Supabase Edge Function

The application uses an Edge Function to post threads to X. You need to deploy it using the [Supabase CLI](https://supabase.com/docs/guides/cli).

1.  **Install and link the Supabase CLI:**
    ```bash
    npm install -g supabase
    supabase login
    supabase link --project-ref <your-project-id>
    ```

2.  **Deploy the function:**
    ```bash
    supabase functions deploy post-to-x
    ```

### 5. Run the Application

Once the setup is complete, you can run the local development server:

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## ⚙️ Configuration & Usage

1.  **Log In:** Click the login button to authenticate with your X account via Supabase.
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

Your OpenRouter API key is stored only in your browser's local storage. However, for maximum security, it is recommended to use this tool on a private computer and to clear your local storage or log out when you are finished.
