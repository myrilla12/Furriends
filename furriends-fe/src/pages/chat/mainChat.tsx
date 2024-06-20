import type { User } from '@supabase/supabase-js'
import { createClient } from '../../../../furriends-backend/utils/supabase/server-props'
import type { GetServerSidePropsContext } from 'next'
import { Text } from '@mantine/core';
import Layout from '@/components/layout';

type ChatProps = {
    user: User;
}

export default function MainChatPage({ user }: ChatProps) {
    return (
        <Layout user={user}>
            <Text>Gonna be the chat page</Text>
        </Layout>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context);

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

    return {
        props: {
            user: data.user,
        },
    };
}