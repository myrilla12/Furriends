import Layout from '@/components/layout';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'

export default function FeedPage({ user }: { user: User }) {
    return (
        <Layout user={user}>
            <div className='flex-grow p-6'>
                <h1 className="mb-7 text-2xl font-bold text-amber-950">Feed - this is a mockup.</h1>
            </div>
            <div className='flex justify-center items-center'>

                <Image
                    width={0}
                    height={0}
                    src='/feed-placeholder.png'
                    alt='Feed Mockup'
                    sizes="100vw"
                    style={{ width: '64%', height: 'auto' }}
                />
            </div>
        </Layout >
    )
}

// fetch user by getting server props
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