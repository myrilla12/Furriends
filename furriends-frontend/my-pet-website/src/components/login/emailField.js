import { TextInput } from '@mantine/core';

export default function EmailField() {
    return (
        <TextInput
          variant="filled"
          label="Email address"
          description="Type email address"
          placeholder="Email address"
        />
    );
}
