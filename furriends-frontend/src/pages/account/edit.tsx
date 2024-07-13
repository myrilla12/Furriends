import Layout from '@/components/layout';
import AccountForm from '@/components/account/accountForm'
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'

/**
 * Page component for editing the user's account.
 *
 * @param {{ user: User }} props - The component props.
 * @param {User} props.user - The user object containing user information.
 * @returns {JSX.Element} The EditAccountPage component.
 */
export default function EditAccountPage({ user }: { user: User }) {
    return (
        <Layout user={user}>
            <main className="flex flex-grow items-center justify-center h-full flex-col p-6">
                <AccountForm user={user} />
            </main>
        </Layout >
    )
}

/**
 * Server-side function to handle user authentication and redirection.
 *
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<{redirect?: {destination: string, permanent: boolean}, props?: {user: User}}>} The redirection object for unauthenticated users or the user object for authenticated users.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)

    const { data, error } = await supabase.auth.getUser()

    // prevent access by unauthenticated users
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