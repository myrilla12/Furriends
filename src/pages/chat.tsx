"use client";
import Layout from '@/components/layout';

import { useEffect, useState, useRef } from "react";
import type { User } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/server-props'
import { createClient as componentCreateClient } from '@/utils/supabase/component';
import type { GetServerSidePropsContext } from 'next'
import { Box, Burger, Drawer, em, Flex, Text } from '@mantine/core';
import ChatNav from '@/components/chat/chatNav';
import { Chats, Message, Profile } from '@/utils/definitions';
import { useRouter } from 'next/router';
import ChatBox from '@/components/chat/chatBox';
import ChatNotFound from '@/components/chat/chatNotFound';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Head from 'next/head';

type ChatProps = {
    user: User;
    chatIds: string[];
    otherUsers: Profile[];
    notifications: number[];
}

/**
 * ChatPage component displays the chat interface.
 *
 * @param {ChatProps} props - The props for the ChatPage component.
 * @returns {JSX.Element} The rendered ChatPage component.
 */
export default function ChatPage({ user, chatIds, otherUsers, notifications }: ChatProps) {
    const supabase = componentCreateClient();
    const router = useRouter();
    const id = router.query;

    const [loading, setLoading] = useState(true);
    const [chatId, setChatId] = useState<string | null>(null);
    const [displayChat, setDisplayChat] = useState<boolean>(false);
    const [chatPartner, setChatPartner] = useState<Profile | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chats, setChats] = useState<Chats>(chatIds.map((chatId, index) => {
        return {
            id: chatId,
            otherUser: otherUsers[index],
            notification: notifications[index],
        }
    }));

    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        /**
         * Loads chat data based on the current chat ID.
         * 
         * @async
         */
        const loadChatData = async () => {
            setLoading(true);
            // check if chat id exists 
            const exists = chatIds.indexOf(String(id.id));

            if (exists !== -1) {
                setChatId(String(id.id));
                setDisplayChat(true); // display chat corresponding to chat id
                setChatPartner(otherUsers[exists]); // save profile of chat partner
                await updateReadAt();
                const messages = await fetchMessages();
                setMessages(messages);
            } else {
                // if user_id given as slug, check if valid 
                const userData = await checkUserExists();

                if (userData) {
                    // make new temporary chat if user_id valid
                    setDisplayChat(true);
                    setChatPartner(userData);
                    setMessages([]);
                    setChatId(null);
                } else {
                    setDisplayChat(false);
                }
            }
            setLoading(false);
        };

        /**
         * Marks messages as read for the currently selected chat. 
         * 
         * @async
         */
        // if there are any messages that are unread that are authored by other user, mark read_at
        const updateReadAt = async () => {
            const currentTimestamp = new Date().toISOString();
            const { error } = await supabase
                .from('messages')
                .update({ read_at: currentTimestamp })
                .eq('chat_id', id.id)
                .neq('author_id', user.id)
                .is('read_at', null);

            if (error) {
                console.error('Error updating read_at values:', error);
                return;
            }
        };

        /**
         * Fetches existing messages for the selected chat. 
         * 
         * @async
         * @returns {Promise<Message[]>} The messages in the chat. 
         */
        // set the state messages to the data from supabase
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('id, created_at, content, author_id, read_at, edited_at, disabled')
                .eq('chat_id', id.id)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages: ', error);
                return [];
            }
            return data;
        };

        /**
         * Checks if a user exists for the given user ID.
         * 
         * @async
         * @returns {Promise<Profile | null>} The user's profile or null if not found.
         */
        // if the id matches up to a user_id instead of chat_id generate user_id info
        const checkUserExists = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, avatar_url, username')
                .eq('id', id.id)
                .single();

            if (error && error.code !== 'PGRST116') { // Code for no matching rows found
                console.error('Error fetching user data:', error);
            }
            return data;
        };

        loadChatData();

        // use supabase realtime
        // following Supabase documentation at https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
        const messagesChannel = supabase
            .channel('messages-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    const eventType = payload.eventType;
                    const newMessage = payload.new as Message;

                    // if messages have been inserted, add to 'messages' state
                    if (eventType === 'INSERT' && newMessage.chat_id === id.id) {
                        setMessages((prevMessages) => [...prevMessages, newMessage]);
                    }

                    // if messages have been updated, update 'messages' state
                    if (eventType === 'UPDATE' && newMessage.chat_id === id.id) {
                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                (msg.id === newMessage.id ? newMessage : msg)
                            ));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messagesChannel);
        };
    }, [id.id, chatIds, otherUsers, supabase, user.id]);

    // make changes to 'chats' table realtime
    useEffect(() => {
        const chatsChannel = supabase
            .channel('chats-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'chats',
                },
                async (payload) => {
                    const eventType = payload.eventType;

                    // if chats have been updated reorder the chats const
                    if (eventType === 'UPDATE') {
                        const fetchChats = async () => {
                            // Fetch the chats with their updated_at field
                            const { data, error } = await supabase
                                .from('chats')
                                .select('id, updated_at')
                                .in('id', chatIds)
                                .order('updated_at', { ascending: false });

                            if (error) {
                                console.error('Error fetching chats:', error);
                            } else {
                                const updatedChats = data.map((chat: { id: string; updated_at: string; }) => ({
                                    id: chat.id,
                                    updated_at: chat.updated_at,
                                    otherUser: otherUsers[chatIds.indexOf(chat.id)] || null,
                                    notification: notifications[chatIds.indexOf(chat.id)] || 0,
                                }));

                                setChats((prevChats) => {
                                    const chatMap = new Map();
                                    prevChats.forEach(chat => chatMap.set(chat.id, chat));
                                    updatedChats.forEach((chat: { id: string; }) => chatMap.set(chat.id, chat));
                                    return Array.from(chatMap.values()).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
                                });
                            }
                        };
                        await fetchChats();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(chatsChannel);
        };
    }, [user.id, chatIds, otherUsers, supabase, notifications])

    const renderMobileVersion = () => (
        <Box>
            <Flex direction="row" align="center" gap="md">
                <p className='text-xl font-bold mb-1'>Open chat navigator</p>
                <Burger opened={opened} onClick={opened ? close : open} aria-label="Toggle navigation" />

                <Drawer
                    opened={opened}
                    onClose={close}
                    title={<p className='text-xl font-bold mb-1'>Chat navigator</p>}
                    size="100%"
                >
                    <div style={{ width: '100%' }}>
                        <ChatNav chats={chats} />
                    </div>
                </Drawer>
            </Flex>
            <Box className="flex-grow h-full w-full">
                {displayChat ?
                    <ChatBox user={user} chatId={chatId} messages={messages} chatPartner={chatPartner} loading={loading} setChats={setChats} /> :
                    <ChatNotFound />
                }
            </Box>
        </Box>
    );

    return (
        <Layout user={user}>
            <Head>
                <title>furriends | chat</title>
                <meta name="Chat page" content="This is the chat page of furriends."></meta>
            </Head>
            <div className="flex flex-grow p-6 md:overflow-y-auto">
                {isMobile ?
                    renderMobileVersion() :
                    <Box style={{ display: 'flex', width: '100%' }}>
                        <Box h={570} ml='xl'>
                            <div style={{ width: '400px' }}>
                                <ChatNav chats={chats} />
                            </div>
                        </Box>
                        <Box className="flex-grow">
                            {displayChat ?
                                <ChatBox user={user} chatId={chatId} messages={messages} chatPartner={chatPartner} loading={loading} setChats={setChats} /> :
                                <ChatNotFound />
                            }
                        </Box>
                    </Box>
                }
            </div>
        </Layout>
    );
}

/**
 * Fetch user data and chat information from the server-side.
 *
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<{ props: { user: User; chatIds: string[]; otherUsers: Profile[]; notifications: number[] } }>} The props for the page.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)

    const { data, error } = await supabase.auth.getUser()

    // redirect unauthenticated users to home page
    if (error || !data) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    // select tuple corresponding to user, expecting a single result
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', data.user.id)
        .single();

    // fetch all chat ids that corespond to user and sort them in descending order of 'updated_at'
    const { data: chatData, error: chatError } = await supabase
        .from('chat_users')
        .select('chat_id, chats(updated_at)')
        .eq('user_id', data.user.id)
        .order('chats(updated_at)', { ascending: false });

    if (chatError) {
        console.error('Error fetching chat IDs:', chatError);
        return;
    }

    const chats = chatData.map((chat: { chat_id: string; }) => chat.chat_id);

    // get the other user that corresponds to the chat ids
    const { data: otherUserData, error: otherUserError } = await supabase
        .from('chat_users')
        .select('user_id, chat_id')
        .in('chat_id', chats)
        .neq('user_id', data.user.id);

    if (otherUserError) {
        console.error('Error fetching the id of the other user in chat:', otherUserError);
        return;
    }

    const otherUserIds = chats.map((chat_id: string) => {
        const user = otherUserData.find((user: { chat_id: string; }) => user.chat_id === chat_id);
        return user ? user.user_id : null;
    }).filter((user_id: string) => user_id !== null);

    // get user profile of the other users
    const { data: otherProfilesData, error: otherProfilesError } = await supabase
        .from('profiles')
        .select('id, avatar_url, username')
        .in('id', otherUserIds);

    if (otherUserError) {
        console.error('Error fetching the id of the other user in chat:', otherUserError);
        return;
    }

    const userIdToIndexMap: Map<string, number> = new Map(
        otherUserIds.map((id: string, index: number): [string, number] => [id, index])
    );

    // sort otherProfilesData based on the order of ids in otherUserIds
    otherProfilesData.sort((a: Profile, b: Profile) => {
        const indexA = userIdToIndexMap.get(a.id);
        const indexB = userIdToIndexMap.get(b.id);

        if (indexA === undefined || indexB === undefined) {
            // handle the case where the ID is not found in the map
            return 0;
        }

        return indexA - indexB;
    });

    // get the number of unread messages for each chat
    const { data: notificationData, error: notificationError } = await supabase
        .from('messages')
        .select('chat_id, read_at, author_id')
        .in('chat_id', chats)
        .is('read_at', null)
        .neq('author_id', data.user.id);

    if (notificationError) {
        console.error('Error fetching notification data:', notificationError);
        return;
    }

    // Create a dictionary to count unread messages for each chat_id
    const unreadCounts = notificationData.reduce((acc: { [x: string]: number; }, message: { chat_id: string; }) => {
        if (!acc[message.chat_id]) {
            acc[message.chat_id] = 0;
        }
        acc[message.chat_id]++;
        return acc;
    }, {});

    // Create an array of notification counts in the same order as chats
    const notifications = chats.map((chat_id: string) => unreadCounts[chat_id] || 0);

    return {
        props: {
            user: data.user,
            chatIds: chats || [],
            otherUsers: otherProfilesData,
            notifications: notifications || [],
        },
    };
}
