import React, { useState } from 'react';
import Layout from '@/components/layout';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '../../utils/supabase/server-props'
import FeedLinks from '@/components/feed/feedLinks';
import { Button, Text } from '@mantine/core';
import { FreelancerPost, Profile } from '@/utils/definitions';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useDisclosure } from '@mantine/hooks';
import ServicePostCreationModal from '@/components/feed/servicePostCreationModal';
import ServicePost from '@/components/feed/servicePost';

/**
 * Page component for displaying and managing pet services.
 *
 * @param {ServicesPageProps} props - The component props.
 * @param {User} props.user - The user object containing user information.
 * @param {Profile} props.profile - The profile object containing user profile information.
 * @returns {JSX.Element} The ServicesPage component.
 */
export default function ServicesPage({ user, profile }: { user: User; profile: Profile; }) {
    const [opened, setOpened] = useState(false);
    const example = {
        photo: "https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg",
        title: "Test post",
        content: "Hello, this is a tester post to see if the post UI looks good iowj djiwj djioqj djiojd iwo jdiow jdiwojd iwjodijw jdiojd iwoqjidojwoiqj djiwoq djiwo djiwo djiwoq djiowq jdiwoq jdiowq djiwoq jdiwoq jwdioq djiwoq djwioq djwioq djwioqd jiwoq dw jiodwj iodjwioq djiwoq djiow djwiqo djiow djiow jdoi djiow djio jdoiw djiow djo djoiq djiow djoi djioq ",
        location: "Tampines",
        pricing: [10, 15],
        author_id: user.id,
        created_at: "2024-07-13 16:51:24.103749+00",
    } as FreelancerPost;
    
    return (
        <Layout user={user}>
            <div className="relative flex-grow px-6 pt-6">
                <FeedLinks />
                <div className="absolute top-6 right-6">
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
                <ServicePostCreationModal user={user} opened={opened} setOpened={setOpened}/>
                <h1 className="mt-7 text-2xl font-bold text-amber-950">Pet services</h1>
                <h2 className="mb-7">For all your pet's needs</h2>
                <ServicePost user={user} post={example}/>
            </div>
        </Layout >
    )
}

/**
 * Server-side function to handle user authentication and fetch user and profile data.
 *
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<{redirect?: {destination: string, permanent: boolean}, props?: {user: User, profile: Profile}}>} The redirection object for unauthenticated users or the user and profile data for authenticated users.
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

    return {
        props: {
            user: data.user,
            profile: profileData, 
        },
    }
}