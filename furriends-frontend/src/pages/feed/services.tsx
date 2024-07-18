import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '../../utils/supabase/server-props'
import { createClient as componentCreateClient } from '@/utils/supabase/component';
import FeedLinks from '@/components/feed/feedLinks';
import { Button, Flex } from '@mantine/core';
import { Post, Profile } from '@/utils/definitions';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import PostCreationModal from '@/components/feed/postCreationModal';
import Feed from '@/components/feed/feed';

type ServicesPageProps = {
    user: User,
    profile: Profile, 
    posts: Post[],
}

/**
 * Page component for displaying and managing pet services.
 *
 * @param {ServicesPageProps} props - The component props.
 * @param {User} props.user - The user object containing user information.
 * @param {Profile} props.profile - The profile object containing user profile information.
 * @param {Post[]} props.posts - All freelancer post information. 
 * @returns {JSX.Element} The ServicesPage component.
 */
export default function ServicesPage({ user, profile, posts }: ServicesPageProps) {
    const supabase = componentCreateClient();
    const [opened, setOpened] = useState(false);
    const [feed, setFeed] = useState<Post[]>(posts);

    // make changes to 'freelancer_posts' table realtime
    useEffect(() => {

        const freelancerPostsChannel = supabase
            .channel('freelancer-posts-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'freelancer_posts',
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
            supabase.removeChannel(freelancerPostsChannel);
        };
    }, [supabase])
    
    return (
        <Layout user={user}>
            <div className="relative flex-grow px-6 pt-6">
                <FeedLinks />
                <div className="absolute top-1 right-1">
                    {profile.freelancer && 
                        <Button 
                            leftSection={<PlusCircleIcon className="w-6"/>} 
                            m='md' 
                            size='md' 
                            variant='light' 
                            color='#6d543e' 
                            radius='md'
                            onClick={() => setOpened(true)}
                        >
                            Create a post
                        </Button>
                    }
                </div>
                <PostCreationModal user={user} opened={opened} setOpened={setOpened} service={true} myCommunities={null}/>
                <Flex direction="row">
                    <div>
                        <h1 className="mt-7 text-2xl font-bold text-amber-950">Pet services</h1>
                        <h2 className="mb-7">For all your pet&apos;s needs</h2>
                    </div>
                    <Feed user={user} posts={feed} service={true} community={null}/>
                </Flex>
   
            </div>
        </Layout >
    )
}

/**
 * Server-side function to handle user authentication and fetch user, profile data and freelancer posts.
 *
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<{redirect?: {destination: string, permanent: boolean}, 
 *      props?: {user: User, profile: Profile, posts: FreelancerPost[]}}>}  
 *      - The redirection object for unauthenticated users or the user, profile data for authenticated users and freelancer post information.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)

    const { data, error } = await supabase.auth.getUser()

    if (error || !data) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`username, avatar_url, freelancer`)
        .eq('id', data?.user?.id)
        .single();

    if (profileError) {
        console.error('Error fetching user profile', profileError);
    }

    const { data: postData, error: postError } = await supabase
        .from('freelancer_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (postError) {
        console.error('Error fetching post data', postError);
    }

    return {
        props: {
            user: data.user,
            profile: profileData, 
            posts: postData,
        },
    }
}