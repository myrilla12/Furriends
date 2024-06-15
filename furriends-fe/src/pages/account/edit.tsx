import Layout from '@/components/layout';
import AccountForm from '@/components/account/accountForm'
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '../../../../furriends-backend/utils/supabase/server-props'

export default function EditAccountPage({ user, avatarUrl }: { user: User, avatarUrl: string }) {
    return (
        <Layout avatarUrl={avatarUrl}>
            <main className="flex flex-grow items-center justify-center h-full flex-col p-6">
                <AccountForm user={user} />
            </main>
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
        .select('avatar_url')
        .eq('id', data.user.id)
        .single();

    // generate signed url linking to correct item is supabase storage bucket
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
            avatarUrl: signedAvatarUrl,
        },
    }
}