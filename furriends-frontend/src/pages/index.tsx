import LogoHeader from '@/components/logoHeader';
import { Button, MantineProvider, Text, Title } from '@mantine/core';
import router from 'next/router';
import BusinessForm from '@/components/map/businessForm';

export default function Home() {
    return (
        <>
            <MantineProvider>
                <div className="flex flex-col min-h-screen">
                    <LogoHeader />
                    <div className="mt-12 mx-auto w-2/3">
                        <Title order={3} className="mb-3">Welcome to{" "}
                            <Text span c='#6d543e' inherit>Furriends</Text>
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