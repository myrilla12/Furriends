import { Text, Space, TextInput, PasswordInput, Button, Box, Group } from '@mantine/core';
import router from 'next/router';
import { useState } from 'react';
import { createClient } from '../../../furriends-backend/utils/supabase/component';

export default function LoginBox() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error);
      setError('Invalid email or password. Please try again.');
    } else {
      router.push('/dashboard');
    }
  }

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

          {error && (
            <>
              <Space h="lg" />
              <Text c="red">{error}</Text>
            </>
          )}

          <Space h="lg" />

          <Button variant="default" color="gray" onClick={login}>Sign in</Button>

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