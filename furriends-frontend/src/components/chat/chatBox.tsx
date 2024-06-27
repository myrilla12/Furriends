import { Box, Button, Center, Container, Flex, Input, ScrollArea, Text } from "@mantine/core";
import { createClient } from "@/utils/supabase/component";
import { useEffect, useRef, useState } from "react";
import { RealtimeChannel, User } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";
import { Message, Profile } from "@/utils/definitions";
import styles from '../../styles/chatStyles.module.css';

type ChatBoxProps = {
  user: User;
  chatId: string | null;
  messages: Message[] | null;
  chatPartner: Profile | null;
}

export default function ChatBox({ user, chatId, messages, chatPartner }: ChatBoxProps) {
  const supabase = createClient();
  const [message, setMessage] = useState<string>('');

  async function sendMessage(content: string) {
    const { data, error } = await supabase
                .from('messages')
                .insert({
                    chat_id: chatId,
                    author_id: user.id,
                    content: content,
                })
  }

  const checkMessage = () => {
    if (message === '') {
      alert('No message received!');
      return false;
    }
    return true;
  }

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
                  (<Text size='sm' fw={700}>{chatPartner?.username}</Text>)
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
            if (e.key === "Enter" && checkMessage()) {
              sendMessage(message)
            }
          }}
          className="flex-[0.5] text-2xl"
        />
        <Button size='lg' color='#ad925a' variant='filled'
          onClick={() => {
            if (checkMessage()) 
              {sendMessage(message)}
            }
          }
        >
          Send
        </Button>  
      </Flex>
    </Container>
  );
}
