import LogoHeader from "@/components/logoHeader";
import SignupBox from "@/components/signup/signupBox";
import { Container, MantineProvider } from "@mantine/core";

/**
 * The Signup component renders the signup page which includes the logo header and the signup box.
 *
 * @returns {JSX.Element} The rendered Signup component.
 */
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