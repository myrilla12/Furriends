// adapted from https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages

import { Text, Space, TextInput, PasswordInput, Button, Container, Box, Group, Divider } from '@mantine/core';
import LoginButton from '../login/loginButton';
import router from 'next/router';
import { useState } from 'react';
import { createClient } from '../../../../furriends-backend/utils/supabase/component';

export default function SignupBox() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const supabase = createClient();

  async function signup() {
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.message.includes('email')) {
        setEmailError("Invalid email format");
      } else if (error.message.includes('password')) {
        setPasswordError(error.message);
      }
      console.error(error);
    } else {
      router.push('/login');
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Box style={{ border: "1px solid black" }} pl="xl" pr="xl" pb="xl" ml="25%" mr='25%'>
          <Box mt='lg' mb='lg'>
            <Text size='22pt' mb='sm' mt='xl' fw={700}>Create a new account</Text>
            <Text size='md' c='dimmed'>Join our pet-friendly community at Furriends! Help your pet make some friends and strengthen your bond with your pet!</Text>

            <Space h="lg" />

            <TextInput
              variant="filled"
              label="Email Address"
              placeholder="Email Address"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />

            {emailError && (
              <>
                <Space h="lg" />
                <Text c="red">{emailError}</Text>
              </>
            )}

            <Space h="lg" />

            <PasswordInput
              variant="filled"
              label="Password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />

            {passwordError && (
              <>
                <Space h="xs" />
                <Text c="red">{passwordError}</Text>
              </>
            )}

            <Space h="lg" />

            <PasswordInput
              variant="filled"
              label="Confirm Password"
              placeholder="Type password again"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.currentTarget.value)}
            />

            {confirmPasswordError && (
              <>
                <Space h="xs" />
                <Text c="red">{confirmPasswordError}</Text>
              </>
            )}

            <Space h='lg' />

            <Button variant="default" color="gray" onClick={signup}>Sign up</Button>

          </Box>

          <Divider />

          <Group>
            <Box mt="lg">
              <Text c='dimmed'>Already have an account?</Text>
            </Box>
            <Box mt='lg'>
              <LoginButton />
            </Box>
          </Group>
        </Box>
      </div>
    </>
  );
}