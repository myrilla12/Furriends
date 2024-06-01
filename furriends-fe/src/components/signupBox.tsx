import { Text, Space, TextInput, PasswordInput, Button, Container, Box, Group, Divider } from '@mantine/core';
import LoginButton from './loginButton';
import router from 'next/router';
import { useState } from 'react';
import { signup } from '../actions/signup';

export default function SignupBox() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(email, password);
    } catch (error) {
      console.error('Sign-up failed', error);
      router.push('/error');
    }
  };

  return (
    <>
      <Box style={{ border: "1px solid black" }} pl="xl" pr="xl" pb="xl" ml="25%" mr='25%'>
        <Box mt='lg' mb='lg'>
          <Text size='24pt' mb='sm'>Create a new account</Text>
          <Text size='md' c='dimmed'>Join our pet friendly community at Furriends! Help your pet make some friends and strengthen your bond with your pet!</Text>

          <Space h="lg" />

          /*
          <TextInput
            variant="filled"
            label="Username"
            placeholder="Username"
          />

          <Space h="lg" />
          */

          <TextInput
            variant="filled"
            label="Email address"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />

          <Space h="lg" />

          <PasswordInput
            variant="filled"
            label="Password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />

          <Space h="lg" />

          <PasswordInput
            variant="filled"
            label="Confirm Password"
            placeholder="Type password again"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
          />

          {error && (
            <>
              <Space h="lg" />
              <Text color="red">{error}</Text>
            </>
          )}

          <Space h='lg' />

          <Button variant="default" color="gray" onClick={handleSignup}>Sign up</Button>

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
    </>
  );
}