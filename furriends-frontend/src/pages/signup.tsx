import LogoHeader from "@/components/logoHeader";
import SignupBox from "@/components/signup/signupBox";
import { Container, MantineProvider } from "@mantine/core";

export default function Signup() {
    return (
        <>
            <MantineProvider>
                <LogoHeader />
                <Container className="flex justify-center items-center" style={{ height: "80vh" }}>
                    <SignupBox />
                </Container>
            </MantineProvider>
        </>
    );
}