import LoginButton from '@/components/loginButton';
import LogoHeader from '@/components/logoHeader';
import { Container, Space } from '@mantine/core';

export default function Home() {
    return (
        <>  
            <LogoHeader />
            <Container>
                <LoginButton />
            </Container>
        </>
    );
}