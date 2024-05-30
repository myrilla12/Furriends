import { Button } from '@mantine/core';
import { useRouter } from 'next/router';

export default function LoginButton() {
  const router = useRouter();

  return <Button variant="default" color="gray" onClick={() => router.push("/login")}>Sign in</Button>;
}
