import Layout from '@/components/layout';

import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '../../../furriends-backend/utils/supabase/server-props'
import { Title } from '@mantine/core';
import Filters from '@/components/pet-matching/filters';
import PetCarousel from '@/components/pet-matching/petCarousel';
import { Pet } from '@/util/definitions';

// define prop types
type DashboardProps = {
    user: User;
    avatarUrl: string;
    username: string;
    children: React.ReactNode;
    petData: Pet[]
};

export default function DashboardPage({ user, username, avatarUrl, petData, children }: DashboardProps) {
    
    console.log("petdtaa", petData)

    return (
        <Layout avatarUrl={avatarUrl}>
            <main className="flex min-h-screen flex-col p-2">
                    <div className="flex-grow p-6 md:overflow-y-auto">
                        <h1 className="mb-8 text-2xl">Welcome, <strong>{username || user.email || 'user'}</strong>!</h1>
                        <h1 className="mb-8 text-2xl font-bold">Find your pet some furriends</h1>
            
                        <Filters />
                        <PetCarousel petData={petData} />
                        {children}
                    </div>
            </main>
        </Layout>
    );
}

// fetch user data (username, profile photo) by getting server props
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)

    const { data, error } = await supabase.auth.getUser()

    // get pet data of pet that do not belong to current user
    const petResponse: any = await supabase
                                    .from('pets')
                                    .select("*")
                                    .neq("owner_id", data?.user?.id)
                              
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
        .select('username, avatar_url')
        .eq('id', data.user.id)
        .single();

    // generate signed url linking to correct item in supabase storage bucket
    let signedAvatarUrl = '';

    if (profileData && profileData.avatar_url) {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('avatars')
            .createSignedUrl(profileData.avatar_url, 3600);

        if (!signedUrlError && signedUrlData) {
            signedAvatarUrl = signedUrlData.signedUrl;
        }
    }

    return {
        props: {
            user: data.user,
            username: profileData?.username || '',
            avatarUrl: signedAvatarUrl,
            petData: petResponse.data ? petResponse.data : []
        },
    }
}