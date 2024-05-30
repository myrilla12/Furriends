import EmailField from "@/components/loginBoxThings/emailField";
import PasswordField from "@/components/loginBoxThings/passwordField";
import { Text, Space } from '@mantine/core';
import SignIn from "@/components/loginBoxThings/signIn";
import { Container } from '@mantine/core';
import { Box } from '@mantine/core';
import { Group } from "@mantine/core";
import SignupButton from "./signupThings/signupButton";

export default function LoginBox() {
  const container = {
    mt: '15%',
    mb: '15%',
    ml: '35%',
    mr: '35%',
    pb: "xl",
    style: {border: "1px solid black"}
  };

  
  
  return (
    <>
      <Container {...container}>
        <Box mb='lg'>
          <header>
              <h1>Sign in to Furriends</h1>
          </header>
            
          <EmailField />
          <Space h="lg" />
          <PasswordField />
          <Space h="lg" />
          <SignIn />
        </Box>

        <hr />

        <Group>
          <Box mt="lg">
            <text>Don't have an account yet?</text>
          </Box>
          <Box mt='lg'>
            <SignupButton />
          </Box>
        </Group>
  
      </Container>
    </>
  );
}