import { Box, Button, Center, Container, Flex, Input, ScrollArea, Text } from "@mantine/core";
import createClient from "../../utils/supabase/api";
import { useEffect, useRef, useState } from "react";
import { RealtimeChannel, User } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";
import { Message } from "@/utils/definitions";
import styles from '../../styles/chatStyles.module.css';

type ChatBoxProps = {
  user: User;
  messages: Message[] | null;
  chatPartner: string;
}

export default function ChatBox({ user, messages, chatPartner }: ChatBoxProps) {
  const [message, setMessage] = useState<string>('');

  return (
    <Container
      m='md'
      className={`${styles.chatContainer}`}
    >
      {/* Display author name + messages in chat bubbles */}
      <Box h={570}>
        <ScrollArea h={550} pb='md' scrollbars="y">
          <div className="mt-5 flex flex-col gap-3">
            {messages?.map((msg, i) => (
            <div
              key={i}
              className={`${styles.chatBubble} ${user.id === msg.author_id ? styles.user : styles.chatPartner}`}
            >   
                {user.id === msg.author_id ? 
                  (<Text size='sm' fw={700}>You</Text>) : 
                  (<Text size='sm' fw={700}>{chatPartner}</Text>)
                }
                {msg.content}
            </div>
          ))}
          </div>
        </ScrollArea>
      </Box>
      
      {/* Input field + button to send messages */}
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
        <Button size='lg' color='#ad925a' variant='filled'
          onClick={() => console.log("send message (to be done)")}
        >
          Send
        </Button>  
      </Flex>
    </Container>
  );
}
