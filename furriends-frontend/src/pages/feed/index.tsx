import Layout from '@/components/layout';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'
import { Button } from '@mantine/core';
import FeedLinks from '@/components/feed/feedLinks';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

/**
 * Page component for displaying the feed.
 *
 * @param {{ user: User }} props - The component props.
 * @param {User} props.user - The user object containing user information.
 * @returns {JSX.Element} The FeedPage component.
 */
export default function FeedPage({ user }: { user: User }) {
    const [opened, setOpened] = useState(false);

    return (
        <Layout user={user}>
            <div className='relative flex-grow p-6'>
                <FeedLinks />
                <div className="absolute top-6 right-6">
                    <Button 
                        leftSection={<PlusCircleIcon className='w-6'/>} 
                        m='md' 
                        size='md' 
                        variant='light' 
                        color='#6d543e' 
                        radius='md'
                        onClick={() => setOpened(true)}
                    >
                        Create a post
                    </Button>
                </div>
                <h1 className="mt-7 text-2xl font-bold text-amber-950">Feed - this is a mockup.</h1>
            </div>
        </Layout >
    )
}

/**
 * Server-side function to handle user authentication and fetch user data.
 *
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<{redirect?: {destination: string, permanent: boolean}, props?: {user: User}}>} The redirection object for unauthenticated users or the user data for authenticated users.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)

    const { data, error } = await supabase.auth.getUser()

    // prevent access by unauthenticated users
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
    }
}