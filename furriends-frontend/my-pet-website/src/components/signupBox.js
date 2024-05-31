import { Text, Space, TextInput, PasswordInput, Button, Container, Box, Group } from '@mantine/core';
import LoginButton from './loginButton';

export default function LoginBox() {
  
  return (
    <>
      <Box style={{border: "1px solid black"}} pl="xl" pr="xl" pb="xl" ml="25%" mr='25%'>
        <Box mt='lg' mb='lg'>
          <Text size='24pt' mb='sm'>Create a new account</Text>
          <Text size='md' c='dimmed'>Join our pet friendly community at Furriends! Help your pet make some friends and strengthen your bond with your pet!</Text>

          <Space h="lg" />

          <TextInput
            variant="filled"
            label="Username"
            placeholder="Username"
          />

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

          <PasswordInput
            variant="filled"
            label="Confirm Password"
            placeholder="Type password again"
          />

          <Space h='lg' />

          <Button variant="default" color="gray" onClick={() => console.log("you clicked login")}>Sign up</Button>
          
        </Box>

        <hr />

        <Group>
          <Box mt="lg">
            <Text c='dimmed'>Already have an account?</Text>
          </Box>
          <Box mt='lg'>
            <LoginButton />
          </Box>
        </Group>
  
      </Box>
    </>
  );
}