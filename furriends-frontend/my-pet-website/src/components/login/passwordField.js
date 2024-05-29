import { PasswordInput } from '@mantine/core';

export default function PasswordField() {
  return (
    <PasswordInput
      variant="filled"
      label="Password"
      description="Input password"
      placeholder="Password"
    />
  );
}