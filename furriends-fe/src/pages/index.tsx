import LoginButton from '@/components/loginButton';
import LogoHeader from '@/components/logoHeader/logoHeader';
import { Container, MantineProvider, Space, Text, Title } from '@mantine/core';

export default function Home() {
    return (
        <>
            <MantineProvider>
                <LogoHeader />
                <Space h="xl" />

                <Container>
                    <Title order={3}>Welcome to{" "}
                        <Text span c='#6d543e' inherit>Furriends</Text>
                    </Title>

                    <Space h="xs" />

                    <Text component="p" size="md">
                        A bespoke app for modern day pet owners.
                    </Text>

                    <Space h="lg" />

                    <LoginButton />
                </Container>
            </MantineProvider>
        </>
    );
}