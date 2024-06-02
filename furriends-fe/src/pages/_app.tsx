import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import '../styles/globals.css'; 
import 'tailwindcss/tailwind.css';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function App({ Component, pageProps }: any) {
  return (
    <MantineProvider theme={theme}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
