import LogoHeader from "@/components/logoHeader";
import SideNav from '@/components/sideNav';
import AccountForm from '@/components/account/accountForm'
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '../../../../furriends-backend/utils/supabase/server-props'

export default function EditAccountPage({ user }: { user: User }) {
    return (
        <main className="flex h-screen flex-col p-6">
            <div className="flex h-25 shrink-0 content-center rounded-lg bg-slate-200 p-1 md:h-25">
                <LogoHeader />
            </div>
            <div className="flex flex-grow flex-row mt-4 gap-4">
                <div className="flex-none w-64">
                    <SideNav />
                </div>
                <div className="flex flex-grow items-center justify-center md:overflow-y-auto">
                    <AccountForm user={user} />
                </div>
            </div>
        </main>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)

    const { data, error } = await supabase.auth.getUser();

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