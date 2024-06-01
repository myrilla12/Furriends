import LoginBox from "@/components/loginBox";
import LogoHeader from "@/components/logoHeader/logoHeader";
import { Container, MantineProvider } from "@mantine/core";

export default function Login() {
    return (
        <>
            <MantineProvider>
                <LogoHeader />
                <Container>  
                    <LoginBox />
                </Container>
            </MantineProvider>
        </>
    );
}