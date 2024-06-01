import { Text, Space, TextInput, PasswordInput, Button } from '@mantine/core';
import { Container } from '@mantine/core';
import { Box } from '@mantine/core';
import { Group } from "@mantine/core";
import router from 'next/router';

export default function LoginBox() {
  
  return (
      <Box style={{border: "1px solid black"}} pl="xl" pr="xl" pb="xl" ml="25%" mr='25%'>
        <Box mt='lg' mb='lg'>
          <Text size='24pt'>Sign in to Furriends</Text>

          <Space h="lg" />
            
          <TextInput
            variant="filled"
            label="Email address"
            placeholder="Email address"
          />

          <Space h="lg" />
          
          <PasswordInput
            variant="filled"
            label="Password"
            placeholder="Password"
          />

          <Space h="lg" />

          <Button variant="default" color="gray" onClick={() => console.log("you clicked login")}>Sign in</Button>
          
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
  );
}