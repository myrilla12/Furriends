import LoginBox from "@/components/loginBox";
import LogoHeader from "@/components/logoHeader";
import { Image, Box, Container } from "@mantine/core";

export default function Login() {
    return (
        <Container>  
            <LogoHeader />
            <LoginBox />
        </Container>
    );
}