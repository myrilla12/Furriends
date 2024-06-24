import Layout from '@/components/layout';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '../../../furriends-backend/utils/supabase/server-props'

export default function EditAccountPage({ user }: { user: User }) {
    return (
        <Layout user={user}>
            <div className="flex-grow p-6">
                <h1 className="mb-7 text-2xl font-bold text-amber-950">Find some new locations to hang out with your furriends!</h1>
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

    return {
        props: {
            user: data.user,
        },
    }
}