import { Button } from '@mantine/core';
import { useRouter } from 'next/router';

export default function SignupButton() {
  const router = useRouter();

  return  <Button variant="transparent" onClick={() => router.push("/signup")}><u>Sign up</u></Button>;
}
