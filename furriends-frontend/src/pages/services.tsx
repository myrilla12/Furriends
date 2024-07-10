import React from 'react';
import Layout from '@/components/layout';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '../utils/supabase/server-props'
import FeedLinks from '@/components/feed + services/feedLinks';
import { Button, Text } from '@mantine/core';
import { Profile } from '@/utils/definitions';
import { PlusCircleIcon } from '@heroicons/react/24/outline';


export default function ServicesPage({ user, profile }: { user: User; profile: Profile; }) {
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
                        >
                            Create a post
                        </Button>
                    }
                </div>
                <h1 className="mt-7 text-2xl font-bold text-amber-950">Pet services</h1>
                <h2 className="mb-7">For all your pet's needs</h2>
            </div>
        </Layout >
    )
}

// fetch user data (profile photo) by getting server props
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