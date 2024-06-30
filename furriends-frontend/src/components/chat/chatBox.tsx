import { Box, Button, Center, Container, Flex, Input, ScrollArea, Text } from "@mantine/core";
import { createClient } from "@/utils/supabase/component";
import { useEffect, useRef, useState } from "react";
import { RealtimeChannel, User } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";
import { Message, Profile } from "@/utils/definitions";
import styles from '../../styles/chatStyles.module.css';
import { useRouter } from "next/router";
import printTimestamp from "@/utils/printTimestamp";

type ChatBoxProps = {
  user: User;
  chatId: string | null;
  messages: Message[] | null;
  chatPartner: Profile | null;
}

export default function ChatBox({ user, chatId, messages, chatPartner }: ChatBoxProps) {

  const supabase = createClient();
  const router = useRouter();
  const [message, setMessage] = useState<string>('');

  async function sendMessage(content: string) {
    // if chat id is null AKA it is a new chat (create new chat)
    let currChatId = chatId;

    if (currChatId === null) {
      const { data: newChatData, error: newChatError } = await supabase
        .from('chats')
        .insert({})
        .select('id')
        .single();

      if (newChatError) {
        console.error('Error creating new chat:', newChatError);
        return;
      }

      currChatId = newChatData.id;

      // create new row in chat users for current user
      const { data: userData, error: usersError } = await supabase
        .from('chat_users')
        .insert([
          {
            chat_id: currChatId,
            user_id: user.id,
          },
          {
            chat_id: currChatId,
            user_id: chatPartner?.id,
          }
        ]);

      if (usersError) {
        console.error('Error storing user id in chat users:', usersError);
      }

      router.push(`/chat?id=${currChatId}`);
    }

    const messageData: Message = {
      chat_id: currChatId,
      author_id: user.id,
      content: content,
    }

    const { data, error } = await supabase
                .from('messages')
                .insert(messageData);
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
                <Text className={styles.chatTimestamp}>{msg.created_at ? printTimestamp(msg.created_at) : ''}</Text>
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
          w={600}
          className={styles.chatInput}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter" && checkMessage()) {
              sendMessage(message).then(() => setMessage(''));
            }
          }}
        />
        <Button size='lg' color='#ad925a' variant='filled'
          className={styles.chatInput}
          onClick={() => {
            if (checkMessage()) 
            sendMessage(message).then(() => setMessage(''));
            }
          }
        >
          Send
        </Button>  
      </Flex>
    </Container>
  );
}
