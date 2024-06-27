import { Container, Stack, Image, Title } from "@mantine/core";
import styles from '../../styles/chatStyles.module.css';

export default function ChatNotFound() {

  return (
    <Container
     m='md'
     className={`${styles.chatContainer}`}
    >   
        <Stack
            align="center"
        >
            <Image
                src="/sadface.png"
                w={400}
                alt="Picture of a sad dog"
            />

            <Title order={2}>Please select an existing chat</Title>
        </Stack>
    </Container>
  );
}
