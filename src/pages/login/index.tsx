import LoginBox from "@/components/login/loginBox";
import LogoHeader from "@/components/logoHeader";
import { Container, MantineProvider } from "@mantine/core";

/**
 * Login component provides a UI for user login.
 *
 * @returns {JSX.Element} The rendered Login component.
 */
export default function Login() {
    return (
        <>
            <MantineProvider>
                <LogoHeader />
                <Container className="flex justify-center items-center" style={{ height: "80vh" }}>  
                    <LoginBox />
                </Container>
            </MantineProvider>
        </>
    );
}