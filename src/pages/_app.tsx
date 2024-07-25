import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import Head from 'next/head';

/**
 * Custom theme configuration for Mantine.
 */
const theme = createTheme({
  /** Put your mantine theme override here */
});

/**
 * Main application component for initializing the MantineProvider and rendering the current page.
 *
 * @param {Object} props - The component props.
 * @param {React.ComponentType} props.Component - The current page component to be rendered.
 * @param {Object} props.pageProps - The initial properties that were preloaded for the current page.
 * @returns {JSX.Element} The App component.
 */
export default function App({ Component, pageProps }: any) {
  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>furriends</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
