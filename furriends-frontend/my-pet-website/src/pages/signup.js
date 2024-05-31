import LogoHeader from "@/components/logoHeader";
import SignupBox from "@/components/signupBox";
import { Box, Container } from "@mantine/core";

export default function Signup() {
    return (
        <>
            <Container>  
                <LogoHeader />
                <SignupBox />
            </Container>
        </>
    );
}