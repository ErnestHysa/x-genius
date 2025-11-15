import React from 'react';

/**
 * A component that renders the Privacy Policy for the application.
 * It is a stateless component that contains static legal text.
 * @returns {JSX.Element} The rendered PrivacyPolicy component.
 */
export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none p-6 text-slate-300">
      <h1>Privacy Policy for X-Genius</h1>
      <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to X-Genius ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
      <ul>
        <li>
          <strong>Authentication Information:</strong> When you authenticate with X (formerly Twitter), the application temporarily handles your OAuth tokens. Once the authentication flow is complete, we store your access token and access secret securely in a local database file on the server. We do not store your X password.
        </li>
        <li>
          <strong>API Keys:</strong> Your OpenRouter API key is stored exclusively in your browser's local storage. It is never transmitted to our servers or stored by us. It is sent directly from your browser to the OpenRouter API for content generation.
        </li>
        <li>
          <strong>Generated Content:</strong> The content you generate using the application is held temporarily in the application's state and is sent to our local backend server only when you choose to post it. We do not store this content after it has been posted.
        </li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, operate, and maintain our services.</li>
        <li>Authenticate your identity to allow posting to your X account.</li>
        <li>Enable you to use third-party services like OpenRouter for content generation.</li>
        <li>Improve and personalize your experience.</li>
      </ul>

      <h2>4. Data Storage and Security</h2>
      <p>
        We take the security of your data seriously.
      </p>
      <ul>
        <li><strong>OpenRouter API Key:</strong> Your API key is stored in your browser's local storage. This means it is stored on your device and is not accessible by us. For your security, we recommend using this tool on a private computer and clearing your browser data if you are on a shared machine.</li>
        <li><strong>Authentication Tokens:</strong> Your X access tokens are stored in a local SQLite database file (`app.db`) on the same machine running the server. Access to this file should be restricted.</li>
      </ul>


      <h2>5. Third-Party Services</h2>
      <p>Our service relies on the following third-party providers:</p>
      <ul>
        <li>
            <strong>OpenRouter:</strong> Used to generate content. Your API key and prompts are sent directly to their service. We recommend reviewing OpenRouter's privacy policy.
        </li>
        <li>
            <strong>X (formerly Twitter):</strong> Your content is posted to the X platform via their API. Your use of X is subject to their own privacy policy and terms of service.
        </li>
      </ul>

      <h2>6. Your Rights</h2>
      <p>
        You have control over your information. You can log out at any time, which will clear your authentication session. You can also clear your browser's local storage to remove the stored OpenRouter API key.
      </p>

      <h2>7. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us.
      </p>
    </div>
  );
};
