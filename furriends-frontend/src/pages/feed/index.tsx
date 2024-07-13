import Layout from '@/components/layout';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'
import { Button, Group } from '@mantine/core';
import FeedLinks from '@/components/feed/feedLinks';

/**
 * Page component for displaying the feed.
 *
 * @param {{ user: User }} props - The component props.
 * @param {User} props.user - The user object containing user information.
 * @returns {JSX.Element} The FeedPage component.
 */
export default function FeedPage({ user }: { user: User }) {
    
    return (
        <Layout user={user}>
            <div className='flex-grow p-6'>
                <FeedLinks />
                <h1 className="mt-7 text-2xl font-bold text-amber-950">Feed - this is a mockup.</h1>
            </div>
            <div className='flex justify-center items-center'>

                <Image
                    width={0}
                    height={0}
                    src='/feed-placeholder.png'
                    alt='Feed Mockup'
                    sizes="100vw"
                    style={{ width: '64%', height: 'auto' }}
                />
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