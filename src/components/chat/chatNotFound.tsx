// image from https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F4653086-cat-cartoon-outline&psig=AOvVaw1fPVGk5YKvF27tJIS9wL6l&ust=1719858655087000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLja9_L6g4cDFQAAAAAdAAAAABAE
import { Container, Stack, Image, Title } from "@mantine/core";
import styles from '../../styles/chatStyles.module.css';

/**
 * Component that displays a message when no chat is selected.
 *
 * @returns {JSX.Element} The ChatNotFound component.
 */
export default function ChatNotFound() {

  return (
    <Container
      m='md'
      className={`${styles.chatContainer}`}
    >
      <Stack
        className="items-center justify-center h-full"
      >
        <Image
          src="/chat-not-found.png"
          w={200}
          alt="Outline of a dog"
        />

        <Title order={3} m="sm">Please select an existing chat</Title>
      </Stack>
    </Container>
  );
}
