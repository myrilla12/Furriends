import LogoHeader from "@/components/logoHeader";
import SideNav from '@/components/sideNav';

import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '../../../furriends-backend/utils/supabase/server-props'

export default function DashboardPage({ user, username }: { user: User, username: string }, { children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen flex-col p-6">
            <div className="flex h-25 shrink-0 content-center rounded-lg bg-slate-200 p-1 md:h-25">
                <LogoHeader />
            </div>
            <div className="flex flex-grow flex-row mt-4 gap-4">
                <div className="flex-none w-64">
                    <SideNav />
                </div>
                <div className="flex-grow p-6 md:overflow-y-auto">
                    <h1 className="mb-8 text-2xl">Welcome, <strong>{username || user.email || 'user'}</strong>!</h1>
                    <h2 className="mb-8 text-xl md:text-xl">Dashboard</h2>
                    {children}
                </div>
            </div>
        </main>
    )
}

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
        .select('username')
        .eq('id', data.user.id)
        .single();

    if (profileError || !profileData) {
        return {
            props: {
                user: data.user,
                username: '',
            },
        }
    }

    return {
        props: {
            user: data.user,
            username: profileData.username,
        },
    }
}