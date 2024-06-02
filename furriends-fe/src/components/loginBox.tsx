import { Text, Space, TextInput, PasswordInput, Button, Box, Group } from '@mantine/core';
import router from 'next/router';
import { useState } from 'react';
import { login } from '../actions/login';

export default function LoginBox() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed', error);
      router.push('/error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Box style={{ border: "1px solid black" }} pl="xl" pr="xl" pb="xl" ml="25%" mr='25%'>
        <Box mt='lg' mb='lg'>
          <Text size='24pt'>Sign in to Furriends</Text>

          <Space h="lg" />

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

          <Button variant="default" color="gray" onClick={handleLogin}>Sign in</Button>

        </Box>

        <hr />

        <Group>
          <Box mt="lg">
            <Text c='dimmed'>Don't have an account yet?</Text>
          </Box>
          <Box mt='lg'>
            <Button variant="transparent" onClick={() => router.push("/signup")}><u>Sign up</u></Button>
          </Box>
        </Group>

      </Box>
    </div>
  );
}