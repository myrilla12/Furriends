import { Head, Html, Main, NextScript } from 'next/document';
import { ColorSchemeScript, Box } from '@mantine/core';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </Head>
      <Box>
        <Main />
        <NextScript />
      </Box>
    </Html>
  );
}
