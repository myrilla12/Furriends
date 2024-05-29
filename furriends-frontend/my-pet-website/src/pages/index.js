import LoginButton from "@/components/login/loginButton";
import EmailField from "@/components/login/emailField";
import PasswordField from "@/components/login/passwordField";
import { Text, Space } from '@mantine/core';

export default function Login() {
  return (
    <>
      <header>
          <h1>Sign in to Furriends</h1>
      </header>
        
      <EmailField />
      <Space h="lg" />
      <PasswordField />
      <Space h="lg" />
      <LoginButton />
    </>
  );
}