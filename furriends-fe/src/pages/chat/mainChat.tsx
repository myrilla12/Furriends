"use client";
import Layout from '@/components/layout';

import { useEffect, useState, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import type { User } from '@supabase/supabase-js'
import { createClient } from '../../utils/supabase/server-props'
import type { GetServerSidePropsContext } from 'next'
import { Box, Button, Group, Input, Text } from '@mantine/core';
import ChatNav from '@/components/chat/chatNav';
import Chat from '@/components/chat/chat';

type ChatProps = {
    user: User;
    chatIds: string[];
    otherUsers: User[];
    //chatNames: string[];
}

export default function MainChatPage({ user, chatIds, otherUsers }: ChatProps) {

    return (
        <Layout user={user}>
            <div className="flex-grow p-6 md:overflow-y-auto">
                <Box style={{"display": "flex"}}>
                    <Box>
                        <ChatNav user={user} chatIds={chatIds} otherUsers={otherUsers} />
                    </Box>
                    <Chat chatIds={chatIds}/>
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

    // use supabase realtime
    const channel = supabase
        .channel('schema-db-changes')
        .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'messages',
        },
        (payload) => console.log(payload)
        )
        .subscribe();

    // fetch all chat ids that corespond to user
    const { data: chatData, error: chatError } = await supabase
        .from('chat_users')
        .select('id')
        .eq('chat_user', data.user.id);

    if (chatError) {
        console.error('Error fetching chat IDs:', chatError);
        return;
    }

    const chats = chatData.map(chat => chat.id);

    // get the other user that corresponds to the chat ids
    const { data: otherUserData, error: otherUserError } = await supabase
        .from('chat_users')
        .select('chat_user')
        .in('id', chats)
        .neq('chat_user', data.user.id);

    if (otherUserError) {
        console.error('Error fetching the id of the other user in chat:', otherUserError);
        return;
    }

    const otherUserIds = otherUserData.map(otherUser => otherUser.chat_user);

    // get user data of the other users
    const otherProfiles = await otherUserIds.map(userId => supabase.auth.admin.getUserById(userId));

    return {
        props: {
            user: data.user,
            chatIds: chatData || [],
            otherUsers: otherProfiles,
            //chatNames: ,
        },
    };
}
