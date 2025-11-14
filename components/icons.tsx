
import React from 'react';

/**
 * Renders the X (formerly Twitter) logo as an SVG icon.
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG properties.
 * @returns {JSX.Element} The X logo icon.
 */
export const XLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

/**
 * Renders a settings/cog icon as an SVG.
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG properties.
 * @returns {JSX.Element} The settings icon.
 */
export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.962a8.714 8.714 0 012.59 0c.55.045 1.02.42 1.11.962l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.962.56.962 1.11 0 .858-.06 1.707-.177 2.541-.046.55-.42 1.02-.962 1.11l-.893.149c-.424.07-.764.383-.93.78-.164.398-.142.854.108 1.204l.527.738c.32.447.27.96-.12 1.45l-.773.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.93l-.15.894c-.09.542-.56.962-1.11.962a8.714 8.714 0 01-2.59 0c-.55-.045-1.02-.42-1.11-.962l-.149-.894a1.007 1.007 0 01-.93-.78c-.164-.398-.854-.142-1.204.108l-.738.527c-.447.32-.96.27-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.962-.56-.962-1.11a8.714 8.714 0 010-2.59c.045-.55.42-1.02.962-1.11l.894-.149a1.007 1.007 0 01.93-.78c.164-.398.142-.854-.108-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.893z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

/**
 * Renders a loading spinner icon as an SVG.
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG properties.
 * @returns {JSX.Element} The loading spinner icon.
 */
export const LoadingSpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="none" viewBox="0 0 24 24" {...props}>
    <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 1.5a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 2.25a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 0112 2.25z" fill="currentColor" />
  </svg>
);

/**
 * Renders an eye icon (for showing passwords) as an SVG.
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG properties.
 * @returns {JSX.Element} The eye icon.
 */
export const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

/**
 * Renders an eye-off icon (for hiding passwords) as an SVG.
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG properties.
 * @returns {JSX.Element} The eye-off icon.
 */
export const EyeOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
);

/**
 * Renders a close icon (X) as an SVG.
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG properties.
 * @returns {JSX.Element} The close icon.
 */
export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

/**
 * Renders an info icon as an SVG.
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG properties.
 * @returns {JSX.Element} The info icon.
 */
export const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);

/**
 * Renders a logout icon as an SVG.
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG properties.
 * @returns {JSX.Element} The logout icon.
 */
export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H21" />
  </svg>
);
