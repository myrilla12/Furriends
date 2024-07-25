import Head from 'next/head';

/**
 * The ErrorPage component for displaying a simple error message.
 *
 * @returns {JSX.Element} The rendered ErrorPage component.
 */
export default function ErrorPage() {
    return (
        <main className='h-screen flex items-center justify-center'>
            <Head>
                <title>Something went wrong</title>
            </Head>
            <p>Sorry, something went wrong</p>
        </main>
    )
}