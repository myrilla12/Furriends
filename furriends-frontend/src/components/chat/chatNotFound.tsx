import { Container, Stack, Image, Title } from "@mantine/core";

export default function ChatNotFound() {

  return (
    <Container bg='var(--mantine-color-orange-light)' m='md' w={850} h={650}>
        <Stack
            align="center"
        >
            <Image
                src="/sadface.png"
                w={400}
                alt="Picture of a sad dog"
            />

            <Title order={2}>Chat not found :(</Title>
        </Stack>
    </Container>
  );
}
