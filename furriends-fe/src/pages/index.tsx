import LoginButton from '@/components/loginButton';
import LogoHeader from '@/components/logoHeader';
import { Container, MantineProvider } from '@mantine/core';

export default function Home() {
    return (
        <>  
            <MantineProvider>
                <LogoHeader />
                <Container>
                    <LoginButton />
                </Container>
            </MantineProvider>
        </>
    );
}