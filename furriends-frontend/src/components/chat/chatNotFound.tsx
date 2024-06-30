// image from https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F4653086-cat-cartoon-outline&psig=AOvVaw1fPVGk5YKvF27tJIS9wL6l&ust=1719858655087000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLja9_L6g4cDFQAAAAAdAAAAABAE
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
                src="/cat-outline.png"
                w={400}
                alt="Picture of a sad dog"
            />

            <Title order={2}>Please select an existing chat</Title>
        </Stack>
    </Container>
  );
}
