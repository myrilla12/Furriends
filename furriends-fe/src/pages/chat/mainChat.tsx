"use client";
import Layout from '@/components/layout';

import { useEffect, useState, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import type { User } from '@supabase/supabase-js'
import { createClient } from '../../../../furriends-backend/utils/supabase/server-props'
import type { GetServerSidePropsContext } from 'next'
import { Box, Button, Group, Input, Text } from '@mantine/core';
import ChatNav from '@/components/chat/chatNav';
import Chat from '@/components/chat/chat';

type ChatProps = {
    user: User;
    chatId: string;
}


export default function MainChatPage({ user, chatId }: ChatProps) {
    /*
    const supabase = createClient();

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
    */

    return (
        <Layout user={user}>
            <div className="flex-grow p-6 md:overflow-y-auto">
                <Box style={{"display": "flex"}}>
                    <Box>
                        <ChatNav user={user} />
                    </Box>
                    <Chat chatId={chatId}/>
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

    return {
        props: {
            user: data.user,
            username: profileData?.username || '',
        },
    };
}
