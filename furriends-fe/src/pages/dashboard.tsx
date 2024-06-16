import Layout from '@/components/layout';

import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '../../../furriends-backend/utils/supabase/server-props'
import DashboardMatch from '@/components/pet-matching/dashboardMatch';

// define prop types
type DashboardProps = {
    user: User;
    username: string;
    children: React.ReactNode;
};

export default function DashboardPage({ user, username, children }: DashboardProps) {
    return (
        <Layout user={user}>
            <main className="flex min-h-screen flex-col p-2">
                    <div className="flex-grow p-6 md:overflow-y-auto">
                        <h1 className="mb-8 text-2xl">Welcome, <strong>{username || user.email || 'user'}</strong>!</h1>
                        <h2 className="mb-8 text-xl md:text-xl">Dashboard</h2>
                        <DashboardMatch />
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
    }
}