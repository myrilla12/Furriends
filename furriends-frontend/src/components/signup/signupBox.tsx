// adapted from https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages

import { Text, TextInput, PasswordInput, Button, Box, Group, Divider, Loader } from '@mantine/core';
import router from 'next/router';
import { useState } from 'react';
import { createClient } from '../../utils/supabase/component';

export default function SignupBox() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function signup() {
    setLoading(true);
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    // if user is not redirected and no error is shown, supabase email rate limit has been exceeded - try again in an hour
    if (error) {
      if (error.message.includes('email')) {
        setEmailError("Invalid email format");
      } else if (error.message.includes('password')) {
        setPasswordError("Password must have at least 6 characters.");
      }
      console.error(error);
      setLoading(false);
    } else {
      setLoading(false);
      alert("Sign up successful! Verify your account using the link in your email.")
      router.push('/login');
    }
  }

  return (
    <Box className="border border-black rounded-lg px-8 py-8 w-full max-w-md">
      <Box>
        <Text size='21pt' mb='xs' className='mb-6 text-amber-950 font-bold'>Create a new account</Text>
        <Text size='md' c='dimmed' className='mb-5'>
          Join our pet-friendly community at <span className="text-brown">furriends</span>!
        </Text>

        <TextInput
          variant="filled"
          label="Email Address"
          placeholder="Email Address"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />

        {emailError && (
          <Text c="red" size="xs" fw={700} className="mt-1">{emailError}</Text>
        )}

        <PasswordInput
          variant="filled"
          label="Password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          className="mt-4"
        />

        {passwordError && (
          <Text c="red" size="xs" fw={700} className="mt-1">{passwordError}</Text>
        )}

        <PasswordInput
          variant="filled"
          label="Confirm Password"
          placeholder="Type password again"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.currentTarget.value)}
          className="mt-4"
        />

        {confirmPasswordError && (
          <Text c="red" size="xs" fw={700} className="mt-1">{confirmPasswordError}</Text>
        )}

        <Button variant="outline" color="#6d543e" onClick={signup} className="mt-5 mb-6">
          {loading ? <Loader size="sm" color="#6d543e" /> : 'Sign up'}
        </Button>
      </Box>

      <Divider size="sm" />

      <Group className="mt-2">
        <Text size="sm" c="dimmed">Already have an account?</Text>
        <Button variant="transparent" color="#6d543e" onClick={() => router.push("/login")}>
          <u>Sign in</u>
        </Button>
      </Group>
    </Box>
  );
}