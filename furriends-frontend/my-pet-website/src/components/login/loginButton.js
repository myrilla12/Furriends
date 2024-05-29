import { Button } from '@mantine/core';

export default function LoginButton() {
  return <Button variant="default" color="gray" onClick={() => console.log("you clicked login")}>Sign in</Button>;
}
  