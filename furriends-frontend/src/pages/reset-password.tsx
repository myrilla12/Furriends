import LoginBox from "@/components/login/loginBox";
import LogoHeader from "@/components/logoHeader";
import { Container } from "@mantine/core";

export default function ResetPassword() {
    return (
        <>
            <LogoHeader />
            <Container>
                <LoginBox />
            </Container>
        </>
    );
}