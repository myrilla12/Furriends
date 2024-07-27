import LogoHeader from '@/components/logoHeader';
import { Button, MantineProvider, Text, Title } from '@mantine/core';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import router from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import BusinessForm from '@/components/map/businessForm';

/**
 * The Home component serves as the landing page for the application.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
export default function Home() {
    return (
        <>
            <MantineProvider>
                <Head>
                    <meta name="Home Page" content="This is the home page of furriends."></meta>
                </Head>
                <div className="flex min-h-screen flex-col p-6">
                    <LogoHeader />

                    <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
                            <div className="mx-auto">
                                <Title order={3} className="mb-3">Welcome to{" "}
                                    <Text span c='#6d543e' inherit>furriends</Text>!
                                </Title>

                                <Text component="p" size="md" className="mb-6">
                                    A bespoke app for modern day pet owners.
                                </Text>

                                <Button
                                    variant="light"
                                    color="#6d543e"
                                    rightSection={<IconArrowNarrowRight size={22} />}
                                    onClick={() => router.push("/login")}
                                >
                                    Sign in
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
                            <Image
                                src="/furriends-desktop.png"
                                width={1600}
                                height={900}
                                className="hidden md:block"
                                alt="Screenshot of the dashboard and map - desktop version"
                            />
                            <Image
                                src="/furriends-mobile.png"
                                width={500}
                                height={580}
                                className="block md:hidden"
                                alt="Screenshot of the dashboard and map - mobile version"
                            />
                        </div>
                    </div>
                    <BusinessForm />
                </div>
            </MantineProvider>
        </>
    );
}