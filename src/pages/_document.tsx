import { Html, Head, Main, NextScript } from "next/document";

/**
 * Custom Document component for customizing the HTML structure of the Next.js application.
 *
 * @returns {JSX.Element} The Document component.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
