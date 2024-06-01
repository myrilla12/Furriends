import LogoHeader from "@/components/logoHeader";
import SignupBox from "@/components/signupBox";
import { Container } from "@mantine/core";

export default function Signup() {
    return (
        <>
            <LogoHeader />
            <Container>  
                <SignupBox />
            </Container>
        </>
    );
}