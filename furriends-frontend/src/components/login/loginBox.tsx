// adapted from https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages

import { Text, TextInput, PasswordInput, Button, Box, Group } from '@mantine/core';
import SignupButton from './signupButton'
import router from 'next/router';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/component';

export default function LoginBox() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error);
      setError('Invalid email or password. Please try again.');
    } else {
      // fetch username for checking whether default username needs to be set
      const { data: profileData, error: profileError, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', data.user?.id)
        .single();

      if (profileError && status !== 406) {
        console.log(profileError);
        throw profileError;
      }

      // set default username using user's email prefix if no username set
      if (!profileData?.username) {
        const emailPrefix = email.split('@')[0]; // split email into parts before & after '@', then store the prefix
        const usernamePrefix = emailPrefix.length <= 5 ? emailPrefix : emailPrefix.substring(0, 5); // take first 5 charas of prefix, or the entire prefix if length <5
        const defaultUsername = usernamePrefix + '***';

        const { error: usernameError } = await supabase.from('profiles').update({ username: defaultUsername }).eq('id', data.user?.id);
        if (usernameError) { console.log(usernameError); }// throw error
      }

      router.push('/dashboard');
    }
  }

  return (
    <Box className="border border-black px-8 py-7 w-full max-w-md">
      <Box className='mb-5'>
        <Text size='21pt' className='mb-6 text-amber-950 font-bold'>Sign In</Text>

        <TextInput
          variant="filled"
          label="Email address"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          className="mb-4"
        />

        <PasswordInput
          variant="filled"
          label="Password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />

        {error && (
          <>
            <Text c="red" size="xs" fw={700} className="mt-1">{error}</Text>
          </>
        )}

        <Button variant="outline" color="#6d543e" onClick={login} className="mt-6">Sign in</Button>

      </Box>

      <hr />

      <Group className="mt-3">
        <Text size="sm" c="dimmed">Don&apos;t have an account yet?</Text>
        <SignupButton />
      </Group>

    </Box>
  );
}