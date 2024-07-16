import Layout from '@/components/layout';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'
import { createClient as CC } from '@/utils/supabase/component';
import { Button, Flex } from '@mantine/core';
import FeedLinks from '@/components/feed/feedLinks';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import PostCreationModal from '@/components/feed/postCreationModal';
import Feed from '@/components/feed/feed';
import { Post } from '@/utils/definitions';

/**
 * Page component for displaying the feed.
 *
 * @param {{ user: User }} props - The component props.
 * @param {User} props.user - The user object containing user information.
 * @param {Post[]} props.posts - The community feed post data. 
 * @returns {JSX.Element} The FeedPage component.
 */
export default function FeedPage({ user, posts }: { user: User; posts: Post[];}) {
    const supabase = CC();
    const [opened, setOpened] = useState(false);
    const [feed, setFeed] = useState<Post[]>(posts)

    // make changes to 'community_posts' table realtime
    useEffect(() => {

        const communityPostsChannel = supabase
            .channel('community-posts-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'community_posts',
                },
                (payload) => {
                    const eventType = payload.eventType;
                    
                    // if new post is inserted, add it to feed
                    if (eventType === 'INSERT') {
                        const newPost = payload.new as Post;
                        setFeed((prevPosts) => [newPost, ...prevPosts]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(communityPostsChannel);
        };
    }, [supabase])

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
                <PostCreationModal user={user} opened={opened} setOpened={setOpened} service={false}/>
                <Flex direction="row">
                    <div>
                        <h1 className="mt-7 text-2xl font-bold text-amber-950">Feed</h1>
                        <h2 className="mb-7">Share your pet adventures</h2>
                    </div>
                    <Feed user={user} posts={feed} service={false}/>
                </Flex>
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

    const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select('*')
        .is('community_id', null)
        .order('created_at', { ascending: false });

    if (postError) {
        console.error('Error fetching post data', postError);
    }

    return {
        props: {
            user: data.user,
            posts: postData,
        },
    }
}