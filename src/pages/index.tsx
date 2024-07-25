import LogoHeader from '@/components/logoHeader';
import { Button, MantineProvider, Text, Title } from '@mantine/core';
import router from 'next/router';
import Head from 'next/head';
import BusinessForm from '@/components/map/businessForm';

/**
 * The Home component serves as the landing page for the application.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
export default function Home() {
    return (
        <>
            <Head>
                <meta name="Home Page" content="This is the home page of furriends."></meta>
            </Head>
            <MantineProvider>
                <div className="flex flex-col min-h-screen">
                    <LogoHeader />
                    <div className="mt-12 mx-auto w-2/3">
                        <Title order={3} className="mb-3">Welcome to{" "}
                            <Text span c='#6d543e' inherit>furriends</Text>
                        </Title>

                        <Text component="p" size="md" className="mb-6">
                            A bespoke app for modern day pet owners.
                        </Text>

                        <Button variant="light" color="#6d543e" onClick={() => router.push("/login")}>
                            Sign in
                        </Button>
                    </div>
                    <BusinessForm />
                </div>
            </MantineProvider>
        </>
    );
}