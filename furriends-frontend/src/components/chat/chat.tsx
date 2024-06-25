// following Supabase documentation at https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
import { Container, Text } from "@mantine/core";
import createClient from "../../utils/supabase/api";

type ChatProps = {
  chatIds: string[];
}

export default function Chat({ chatIds }: ChatProps) {

  return (
    <Container bg='var(--mantine-color-blue-light)' m='md' w={1000} h={650}>
      <Text>The chat page for each individual chat will be here</Text>
    </Container>
  );
}
