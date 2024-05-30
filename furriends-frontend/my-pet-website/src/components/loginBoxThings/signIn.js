import { Button } from '@mantine/core';

export default function SignIn() {
  return <Button variant="default" color="gray" onClick={() => console.log("you clicked login")}>Sign in</Button>;
}