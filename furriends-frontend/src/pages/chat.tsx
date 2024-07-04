"use client";
import Layout from '@/components/layout';

import { useEffect, useState, useRef } from "react";
import type { User } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/server-props'
import { createClient as CC } from '@/utils/supabase/component';
import type { GetServerSidePropsContext } from 'next'
import { Box } from '@mantine/core';
import ChatNav from '@/components/chat/chatNav';
import { Chats, Message, Profile } from '@/utils/definitions';
import { useRouter } from 'next/router';
import ChatBox from '@/components/chat/chatBox';
import ChatNotFound from '@/components/chat/chatNotFound';

type ChatProps = {
    user: User;
    chatIds: string[];
    otherUsers: Profile[];
    notifications: number[];
}

export default function ChatPage({ user, chatIds, otherUsers, notifications }: ChatProps) {
    const supabase = CC();
    const router = useRouter();
    const id = router.query;

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

    useEffect(() => { 
        // check if chat id exists 
        const exists = chatIds.indexOf(String(id.id));
        
        // if the id matches up to a user_id instead of chat_id generate user_id info
        async function checkUserExists() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, avatar_url, username')
                    .eq('id', id.id)
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') { // Code for no matching rows found
                        return null;
                    }
                    console.error('Error fetching user data:', error);
                    return null;
                }
                return data;
            } catch (error) {
                console.error('An error has occurred:', error);
                return null;
            }
        }

        if (exists !== -1) {
            setChatId(String(id.id));
            setDisplayChat(true); // display chat corresponding to chat id
            setChatPartner(otherUsers[exists]); // save profile of chat partner

            // if there are any messages that are unread that are authored by other user, mark read_at
            const currentTimestamp = new Date().toISOString();

            const updateReadAt = async () => {
                const { data, error } = await supabase
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

            updateReadAt();

            // set the state messages to the data from supabase
            supabase
                .from('messages')
                .select('created_at, content, author_id, read_at')
                .eq('chat_id', id.id)
                .order('created_at', { ascending: true })
                .then((res: any) => {
                    setMessages(res.data);
            });

        } else {
            // if user_id given as slug, check if valid 
            checkUserExists().then((userData: any) => {
                if (id.id && userData) {
                    // make new temporary chat if user_id valid
                    setDisplayChat(true);
                    setChatPartner(userData);
                    setMessages([]);
                    setChatId(null);
                } else {
                    setDisplayChat(false);
                }
            });
        }

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

                    // if messages have been inserted, add to 'messages' state
                    if (eventType === 'INSERT') {
                        const newMessage = payload.new as Message;
                        newMessage.chat_id === id.id
                        setMessages((prevMessages) => [...prevMessages, newMessage]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messagesChannel);
        };
    }, [id])

    // make changes to 'chats' table realtime
    useEffect(() => {

        const messagesChannel = supabase
            .channel('chats-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'chats',
                },
                (payload) => {
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
                              const chatsWithOtherUsers = data.map((chat: { id: string; }) => ({
                                ...chat,
                                otherUser: otherUsers[chatIds.indexOf(chat.id)],
                                // notification: notifications[chatIds.indexOf(chat.id)],
                              }));
                              setChats(chatsWithOtherUsers)
                            }
                        };

                        fetchChats();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messagesChannel);
        };
    }, [chatIds, otherUsers])

    return (
        <Layout user={user}>
            <div className="flex flex-grow p-6 md:overflow-y-auto">
                <Box style={{ display: 'flex', width: '100%' }}>
                    <Box ml='xl' className="flex-shrink-0 w-60 md:w-1/3">
                        <ChatNav chats={chats} />
                    </Box>
                    <Box className="flex-grow">
                        {displayChat? 
                            <ChatBox user={user} chatId={chatId} messages={messages} chatPartner={chatPartner}/> :
                            <ChatNotFound />
                        }    
                    </Box>
                </Box>
            </div>
        </Layout>
    );
}

// fetch user data by getting server props
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
