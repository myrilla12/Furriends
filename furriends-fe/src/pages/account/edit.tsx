import Layout from '@/components/layout';
import AccountForm from '@/components/account/accountForm'
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '../../../../furriends-backend/utils/supabase/server-props'

export default function EditAccountPage({ user }: { user: User }) {
    return (
        <Layout user={user}>
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

    return {
        props: {
            user: data.user,
        },
    }
}