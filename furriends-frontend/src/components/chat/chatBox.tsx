import { Box, Button, Container, Flex, Input, Menu, Text } from "@mantine/core";
import { createClient } from "@/utils/supabase/component";
import { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { Message, Profile } from "@/utils/definitions";
import styles from '../../styles/chatStyles.module.css';
import printTimestamp from "@/utils/printTimestamp";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

type ChatBoxProps = {
  user: User;
  chatId: string | null;
  messages: Message[] | null;
  chatPartner: Profile | null;
}

export default function ChatBox({ user, chatId, messages, chatPartner }: ChatBoxProps) {

    const supabase = createClient();
    const router = useRouter();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState<string>('');
    const [editing, setEditing] = useState<boolean>(false);
    const [messageToEdit, setMessageToEdit] = useState<string | null>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    async function sendMessage(content: string) {
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

        const currentTimestamp = new Date().toISOString();

        const { error: chatsError } = await supabase
            .from('chats')
            .update({ updated_at: currentTimestamp })
            .eq('id', currChatId);

        if (chatsError) {
            console.error("Error updating the 'updated_at' column in 'chats':", chatsError);
        }

        scrollToBottom();
    }

    async function editMessage(content: string) {
        const currentTimestamp = new Date().toISOString();

        const { error: editError } = await supabase
            .from('messages')
            .update({ content: content, edited_at: currentTimestamp })
            .eq('id', messageToEdit);

        if (editError) {
            console.error("Error editing message:", editError);
        }
    }

    const checkMessage = () => {
        if (message === '' || message === null) {
            alert('No message received!');
            return false;
        }
        return true;
    };

    return (
    <Container m='md' className={`${styles.chatContainer}`}>
        {/* Display author name + messages in chat bubbles */}
        <Box h={570}>
            <Box h={550} pb='md' ref={scrollAreaRef} style={{"overflow": "auto"}}>
                <div className="mt-5 flex flex-col gap-3">
                    {messages?.map((msg, i) => (
                        <div key={i} className={`${styles.chatBubble} ${user.id === msg.author_id ? styles.user : styles.chatPartner}`}>
                            {user.id === msg.author_id ? (
                                <Menu>
                                    <Menu.Target>
                                        {/* Chat bubble with author name, content, timestamp and read / unread */}
                                        <div>
                                            {user.id === msg.author_id ? 
                                            (<Text size='sm' fw={700}>You</Text>) : 
                                            (<Text size='sm' fw={700}>{chatPartner?.username}</Text>)
                                            }
                                            {msg.content}
                                            <div style={{ display: 'flex' }}>
                                                <Text mr='md' className={styles.chatTimestamp}>
                                                    {msg.created_at ? printTimestamp(msg.created_at) : ''}
                                                </Text>
                                                {user.id === msg.author_id ? 
                                                    msg.read_at === null ? (<Text mr='md' fw={500} className={styles.chatTimestamp}>Unread</Text>) : 
                                                    (<Text mr='md' fw={500} className={styles.chatTimestamp}>Read</Text>) : ''
                                                }
                                                {msg.edited_at ? (<Text mr='md' fw={500} className={styles.chatTimestamp}>Edited</Text>) : ''}
                                            </div>
                                        </div>
                                    </Menu.Target>
                            
                                    {/* drop down menu with 'edit' and 'delete' when chat bubble is clicked */}
                                    <Menu.Dropdown>
                                        <Menu.Item onClick={() => {
                                            setEditing(true);
                                            msg.id ? setMessageToEdit(msg.id) : '';
                                            setMessage(msg.content);
                                        }}>
                                            <div className="flex items-center">
                                                <PencilIcon className="h-5 w-5" />
                                                <Text size='sm' ml='sm'>Edit</Text>
                                            </div>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <div className="flex items-center">
                                                <TrashIcon className="h-5 w-5" />
                                                <Text size='sm' ml='sm'>Delete</Text>
                                            </div>
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu> ) : 
                                
                                (<div>
                                    {user.id === msg.author_id ? 
                                    (<Text size='sm' fw={700}>You</Text>) : 
                                    (<Text size='sm' fw={700}>{chatPartner?.username}</Text>)
                                    }
                                    {msg.content}
                                    <div style={{ display: 'flex' }}>
                                        <Text mr='md' className={styles.chatTimestamp}>
                                            {msg.created_at ? printTimestamp(msg.created_at) : ''}
                                        </Text>
                                        {user.id === msg.author_id ? 
                                            msg.read_at === null ? (<Text mr='md' fw={500} className={styles.chatTimestamp}>Unread</Text>) : 
                                            (<Text mr='md' fw={500} className={styles.chatTimestamp}>Read</Text>) : ''
                                        }
                                        {msg.edited_at ? (<Text mr='md' fw={500} className={styles.chatTimestamp}>Edited</Text>) : ''}
                                    </div>
                                </div>)}
                        </div>))}
                </div>
            </Box>
        </Box>
        
        {editing ?
            // if editing is true, show display for editing messages
            <Flex gap="md" justify="center" align="flex-end" direction="row" wrap="wrap">
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
                            editMessage(message).then(() => {setMessage(''); setMessageToEdit(null);});
                            setEditing(false);
                        }
                    }}
                />
                <Button size='lg' color='#ad925a' variant='filled' className={styles.chatInput}
                    onClick={() => {
                        if (checkMessage()) {
                            editMessage(message).then(() => {setMessage(''); setMessageToEdit(null);});
                        }
                        setEditing(false);
                    }}
                >
                    Finish edit
                </Button>  
            </Flex> :

            // Input field + button to send messages 
            <Flex gap="md" justify="center" align="flex-end" direction="row" wrap="wrap">
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
                <Button size='lg' color='#ad925a' variant='filled' className={styles.chatInput}
                    onClick={() => {
                        if (checkMessage()) {
                            sendMessage(message).then(() => setMessage(''));
                        }
                    }}
                >
                    Send
                </Button>  
            </Flex>
        }
    </Container>
  );
}
