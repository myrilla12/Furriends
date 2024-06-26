import { Box, Button, Center, Container, Flex, Input, Text } from "@mantine/core";
import createClient from "../../utils/supabase/api";
import { useEffect, useRef, useState } from "react";
import { RealtimeChannel, User } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";
import { Message } from "@/utils/definitions";

type ChatBoxProps = {
  user: User;
  messages: Message[] | null;
}

export default function ChatBox({ user, messages }: ChatBoxProps) {
  const [message, setMessage] = useState<string>('');

  return (
    <Container bg='var(--mantine-color-orange-light)' m='md' w={850} h={650}>
      <Box h={570}>
        <div className="mt-5 flex flex-col gap-3">
          {messages?.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg w-2/3 text-sm bg-${
              user.id === msg.author_id ? "blue-800" : "gray-600"
            } ${user.id === msg.author_id ? "self-end" : "self-start"}`}
          >
              {msg.content}
          </div>
        ))}
        </div>
      </Box>
      
      <Flex
        gap="md"
        justify="center"
        align="flex-end"
        direction="row"
        wrap="wrap"
        >
        <Input
          type="text"
          placeholder="Message"
          value={message}
          size="lg"
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              console.log("send message (to be done)");
            }
          }}
          className="flex-[0.5] text-2xl"
        />
        <Button size='lg' color='#6d543e' variant='light'
          onClick={() => console.log("send message (to be done)")}
        >
          Send
        </Button>  
      </Flex>
    </Container>
  );
}
