import { Container, Stack, Image, Title } from "@mantine/core";
import styles from '../../styles/chatStyles.module.css';

/**
 * Component that displays a message when no chat is selected.
 *
 * @returns {JSX.Element} The ChatNotFound component.
 */
export default function ChatNotFound() {
    return (
        <Container m='md' className={`${styles.chatContainer}`}>
            <Stack className="items-center justify-center h-full text-center">
                <Image
                    src="/chat-not-found.png"
                    w={200}
                    alt="Outline of a dog"
                />
                <Title order={3} mx="sm" mt="sm">No chat selected.</Title>
                <Title order={3} mx="sm" mb="sm">Please start a new chat or select an existing chat.</Title>
            </Stack>
        </Container>
    );
}
