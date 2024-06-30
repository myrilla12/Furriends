"use client";
import Layout from '@/components/layout';

import { useEffect, useState, useRef } from "react";
import type { User } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/server-props'
import { createClient as CC } from '@/utils/supabase/component';
import type { GetServerSidePropsContext } from 'next'
import { Box } from '@mantine/core';
import ChatNav from '@/components/chat/chatNav';
import { Message, Profile } from '@/utils/definitions';
import { useRouter } from 'next/router';
import ChatBox from '@/components/chat/chatBox';
import ChatNotFound from '@/components/chat/chatNotFound';

type ChatProps = {
    user: User;
    chatIds: string[];
    otherUsers: Profile[];
}

export default function ChatPage({ user, chatIds, otherUsers }: ChatProps) {
    const supabase = CC();
    const router = useRouter();
    const id = router.query;

    const [chatId, setChatId] = useState<string | null>(null);
    const [displayChat, setDisplayChat] = useState<boolean>(false);
    const [chatPartner, setChatPartner] = useState<Profile | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

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

            // set the state messages to the data from supabase
            supabase
                .from('messages')
                .select('created_at, content, author_id')
                .eq('chat_id', id.id)
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
        const channel = supabase
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
            },
            (payload) => {
                const newMessage = payload.new as Message;

                if (newMessage.chat_id === id.id) {
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            }
        )
        .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id])

    return (
        <Layout user={user}>
            <div className="flex-grow p-6 md:overflow-y-auto">
                <Box style={{"display": "flex"}}>
                    <Box ml='xl' mr='xl'>
                        <ChatNav chatIds={chatIds} otherUsers={otherUsers} />
                    </Box>
                        {displayChat? 
                            <ChatBox user={user} chatId={chatId} messages={messages} chatPartner={chatPartner}/> :
                            <ChatNotFound />
                        }    
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

    // fetch all chat ids that corespond to user
    const { data: chatData, error: chatError } = await supabase
        .from('chat_users')
        .select('chat_id')
        .eq('user_id', data.user.id);

    if (chatError) {
        console.error('Error fetching chat IDs:', chatError);
        return;
    }

    const chats = chatData.map((chat: { chat_id: string; }) => chat.chat_id);

    // get the other user that corresponds to the chat ids
    const { data: otherUserData, error: otherUserError } = await supabase
        .from('chat_users')
        .select('user_id')
        .in('chat_id', chats)
        .neq('user_id', data.user.id);

    if (otherUserError) {
        console.error('Error fetching the id of the other user in chat:', otherUserError);
        return;
    }

    const otherUserIds = otherUserData.map((otherUser: { user_id: string; }) => otherUser.user_id);

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
    
    // Sort otherProfilesData based on the order of ids in otherUserIds
    otherProfilesData.sort((a: Profile, b: Profile) => {
        const indexA = userIdToIndexMap.get(a.id);
        const indexB = userIdToIndexMap.get(b.id);
    
        if (indexA === undefined || indexB === undefined) {
            // Handle the case where the ID is not found in the map
            return 0;
        }
    
        return indexA - indexB;
    });

    return {
        props: {
            user: data.user,
            chatIds: chats || [],
            otherUsers: otherProfilesData,
        },
    };
}
