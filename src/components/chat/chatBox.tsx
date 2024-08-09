import { Box, Button, Container, Flex, Input, Loader, Menu, Text } from "@mantine/core";
import { createClient } from "@/utils/supabase/component";
import { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { Chats, Message, Profile } from "@/utils/definitions";
import styles from '../../styles/chatStyles.module.css';
import printTimestamp from "@/utils/printTimestamp";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

type ChatBoxProps = {
  user: User;
  chatId: string | null;
  messages: Message[] | null;
  chatPartner: Profile | null;
  loading: boolean;
  setChats: React.Dispatch<React.SetStateAction<Chats>>;
}

/**
 * Component for displaying and managing a chat box.
 *
 * @param {ChatBoxProps} props - The component props.
 * @param {User} props.user - The current user.
 * @param {string | null} props.chatId - The ID of the chat.
 * @param {Message[] | null} props.messages - The array of messages in the chat.
 * @param {Profile | null} props.chatPartner - The chat partner's profile.
 * @param {boolean} props.loading - Whether chat box is loading or not. 
 * @param {React.Dispatch<React.SetStateAction<Chats>>} props.setChats - Function to update state Chats.
 * @returns {JSX.Element} The chat box component.
 */
export default function ChatBox({ user, chatId, messages, chatPartner, loading, setChats }: ChatBoxProps) {

    const supabase = createClient();
    const router = useRouter();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState<string>('');
    const [editing, setEditing] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [messageToChange, setMessageToChange] = useState<string | null>(null);

    /**
     * Scrolls the chat area to the bottom.
     */
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

    /**
     * Sends a message in the chat.
     *
     * @async
     * @param {string} content - The content of the message to send.
     */
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

        setChats((prevChats) => {
            const newChat = {
                id: currChatId as string,
                otherUser: chatPartner as Profile,
                notification: 0,
            };

            return [newChat, ...prevChats];
        });

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

    /**
     * Edits a message in the chat.
     *
     * @async
     * @param {string} content - The new content of the message.
     */
    async function editMessage(content: string) {
        const currentTimestamp = new Date().toISOString();

        const { error: editError } = await supabase
            .from('messages')
            .update({ content: content, edited_at: currentTimestamp })
            .eq('id', messageToChange);

        if (editError) {
            console.error("Error editing message:", editError);
        }
    }

    /**
     * Deletes a message in the chat.
     *
     * @async
     * @param {string} id - The ID of the message to delete.
     */
    async function deleteMessage(id: string) {

        const { error: deleteError } = await supabase
            .from('messages')
            .update({ disabled: true })
            .eq('id', messageToChange);

        if (deleteError) {
            console.error("Error editing message:", deleteError);
        }
    }

    /**
     * Checks if the message is valid or empty.
     *
     * @returns {boolean} - Returns true if the message is valid, otherwise false.
     */
    const checkMessage = () => {
        if (message === '' || message === null) {
            alert('No message received!');
            return false;
        }
        return true;
    };

    return (
    <Container h='auto' m='md' className={`${styles.chatContainer}`}>
        {/* Display author name, messages, timestamp, read? and edited? in chat bubbles */}
        <Box h={520} pt='sm'>
            {loading ? 
            <Flex h={500} align="center" justify="center"><Loader size="xl" color="#6d543e" /></Flex> :
            <Box h={500} pb='md' ref={scrollAreaRef} style={{"overflow": "auto"}}>
                <div className="mt-5 flex flex-col gap-3">
                    {messages?.map((msg, i) => (
                        <div 
                            key={i} 
                            className={`${styles.chatBubble} ${user.id === msg.author_id ? styles.user : styles.chatPartner}`}
                        >
                            {msg.disabled ? 
                                (<Text ta='center' size='sm' fs='italic'>Message deleted</Text>) : 
                                user.id === msg.author_id ? (
                                <Menu>
                                    <Menu.Target>
                                        {/* Users own chat bubbles will have drop down menu for edit and delete */}
                                        <div>
                                            <Text size='sm' fw={700}>You</Text>
                                            {msg.content}
                                            <div style={{ display: 'flex' }}>
                                                <Text mr='md' className={styles.chatTimestamp}>
                                                    {msg.created_at ? printTimestamp(msg.created_at) : ''}
                                                </Text>
                                                {msg.read_at === null ? 
                                                    (<Text mr='md' fw={500} className={styles.chatTimestamp}>Unread</Text>) : 
                                                    (<Text mr='md' fw={500} className={styles.chatTimestamp}>Read</Text>)
                                                }
                                                {msg.edited_at ? (<Text mr='md' fw={500} className={styles.chatTimestamp}>Edited</Text>) : ''}
                                            </div>
                                        </div>
                                    </Menu.Target>
                            
                                    {/* drop down menu with 'edit' and 'delete' when chat bubble is clicked */}
                                    <Menu.Dropdown>
                                        <Menu.Item onClick={() => {
                                            setEditing(true);
                                            msg.id ? setMessageToChange(msg.id) : '';
                                            setMessage(msg.content);
                                        }}>
                                            <div className="flex items-center">
                                                <PencilIcon className="h-5 w-5" />
                                                <Text size='sm' ml='sm'>Edit</Text>
                                            </div>
                                        </Menu.Item>
                                        <Menu.Item onClick={() => {
                                            setDeleting(true);
                                            msg.id ? setMessageToChange(msg.id) : '';
                                        }}>
                                            <div className="flex items-center">
                                                <TrashIcon className="h-5 w-5" />
                                                <Text size='sm' ml='sm'>Delete</Text>
                                            </div>
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu> ) : 
                                
                                (<div>
                                    <Text size='sm' fw={700}>{chatPartner?.username}</Text>
                                    {msg.content}
                                    <div style={{ display: 'flex' }}>
                                        <Text mr='md' className={styles.chatTimestamp}>
                                            {msg.created_at ? printTimestamp(msg.created_at) : ''}
                                        </Text>
                                        {msg.edited_at ? (<Text mr='md' fw={500} className={styles.chatTimestamp}>Edited</Text>) : ''}
                                    </div>
                                </div>)}
                        </div>))}
                </div>
            </Box>}
        </Box>
        
        {editing ?
            // if editing is true, show display for editing messages
            <Flex gap="md" justify="center" align="flex-end" direction="row" wrap="nowrap" pt='sm' pb='xl'>
                <Input
                    type="text"
                    placeholder="Message"
                    value={message}
                    size="md"
                    className={styles.chatInput}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === "Enter" && checkMessage()) {
                            editMessage(message).then(() => {setMessage(''); setMessageToChange(null);});
                            setEditing(false);
                        }
                    }}
                />
                <Button size='md' color='#ad925a' variant='filled' className={styles.chatButton}
                    onClick={() => {
                        if (checkMessage()) {
                            editMessage(message).then(() => {setMessage(''); setMessageToChange(null);});
                        }
                        setEditing(false);
                    }}
                >
                    Finish edit
                </Button>  
                <Button
                    size='md'
                    variant='filled' 
                    color='rgba(255, 5, 5, 1)'
                    onClick={() => {setMessage(''); setEditing(false);}}
                >
                    Cancel
                </Button>
            </Flex> :

            deleting ? 
                // if deleting is true show display for deleting messages
                <Flex gap='lg' justify='center' pb='xl'>
                    <Button
                        variant='subtle'
                        onClick={() => {
                            messageToChange ? deleteMessage(messageToChange).then(() => {
                                setMessageToChange(null);
                                setDeleting(false);
                            }) : setDeleting(false);
                        }}
                    >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Delete?
                    </Button> 
                    <Button
                        variant='filled' 
                        color='rgba(255, 5, 5, 1)'
                        onClick={() => { setDeleting(false)}}
                    >
                        Cancel
                    </Button>
                </Flex> :
            // Input field + button to send messages 
            <Flex gap="md" justify="center" align="flex-end" direction="row" wrap="nowrap" pt='sm' pb='xl'>
                <Input
                    type="text"
                    placeholder="Message"
                    value={message}
                    size="lg"
                    className={styles.chatInput}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === "Enter" && checkMessage()) {
                        sendMessage(message).then(() => setMessage(''));
                        }
                    }}
                />
                <Button size='lg' color='#ad925a' variant='filled' className={styles.chatButton}
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
