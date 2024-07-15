// adapted from https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages

import { Text, TextInput, PasswordInput, Button, Box, Group, Loader } from '@mantine/core';
import router from 'next/router';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/component';
import { setCookie } from 'nookies';

/**
 * Component for the login box.
 *
 * @returns {JSX.Element} The LoginBox component.
 */
export default function LoginBox() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles the login process.
   *
   * @async
   * @function login
   */
  async function login() {
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error);
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    } else {
      const user = data.user;
      // fetch username for checking whether default username needs to be set
      const { data: profileData, error: profileError, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', data.user?.id)
        .single();

      if (profileError && status !== 406) {
        console.log(profileError);
        setLoading(false);
        throw profileError;
      }

      // set default username using user's email prefix if no username set
      if (!profileData?.username) {
        const emailPrefix = email.split('@')[0]; // split email into parts before & after '@', then store the prefix
        const usernamePrefix = emailPrefix.length <= 5 ? emailPrefix : emailPrefix.substring(0, 5); // take first 5 charas of prefix, or the entire prefix if length <5
        const defaultUsername = usernamePrefix + '***';

        const { error: usernameError } = await supabase.from('profiles').update({ username: defaultUsername }).eq('id', data.user?.id);
        if (usernameError) {
          console.log(usernameError); // throw error
          setLoading(false);
        }
      }

      // set session cookie to show location input modal
      setCookie(null, 'showLocationModal', 'true', {
        maxAge: 60 * 15, // 15 minutes
        path: '/',
      });

      router.push('/dashboard');
    }
  }

  return (
    <Box className="border border-black rounded-lg px-8 py-7 w-full max-w-md">
      <div className='mb-6'>
        <Text size='21pt' className='mb-6 text-amber-950 font-bold'>Sign In</Text>

        <TextInput
          variant="filled"
          label="Email address"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          className="mb-4"
        />

        <PasswordInput
          variant="filled"
          label="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        {error && (
          <>
            <Text c="red" size="xs" fw={700} className="mt-1">{error}</Text>
          </>
        )}

        <Button
          variant="outline"
          color="#6d543e"
          rightSection={loading && <Loader size="sm" color="#6d543e" />}
          className="mt-6"
          onClick={login}
        >
          Sign in
        </Button>
      </div>

      <hr />

      <Group gap="lg" className="mt-3">
        <Text size="sm" c="dimmed">Don&apos;t have an account yet?</Text>
        <Button variant="transparent" c="#6d543e" className="ml-2" onClick={() => router.push("/signup")}>
          <u>Sign up</u>
        </Button>
      </Group>

      <Group gap="xl">
        <Text size="sm" c="dimmed">Trouble signing in?</Text>
        <Button variant="transparent" c="#6d543e" onClick={() => router.push("/login/forgot-password")}>
          <u>Reset password</u>
        </Button>
      </Group>

    </Box>

  );
}