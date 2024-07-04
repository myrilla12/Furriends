import LogoHeader from '@/components/logoHeader';
import { Button, Container, MantineProvider, Space, Text, Title } from '@mantine/core';
import router from 'next/router';

export default function Home() {
    return (
        <>
            <MantineProvider>
                <LogoHeader />
                <Container className="mt-10">
                    <Title order={3} className="mb-3">Welcome to{" "}
                        <Text span c='#6d543e' inherit>Furriends</Text>
                    </Title>

                    <Text component="p" size="md" className="mb-6">
                        A bespoke app for modern day pet owners.
                    </Text>

                    <Button variant="light" color="#6d543e" onClick={() => router.push("/login")}>
                        Sign in
                    </Button>
                </Container>
            </MantineProvider>
        </>
    );
}