import LogoHeader from "@/components/logoHeader";
import SignupBox from "@/components/signupBox";
import { Container, MantineProvider } from "@mantine/core";

export default function Signup() {
    return (
        <>
            <MantineProvider>
                <LogoHeader />
                <Container>  
                    <SignupBox />
                </Container>
            </MantineProvider>
        </>
    );
}