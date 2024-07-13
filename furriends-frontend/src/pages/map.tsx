import React from 'react';
import Map from '@/components/map';
import Layout from '@/components/layout';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'
import BusinessForm from '@/components/map/businessForm';


export default function MapPage({ user }: { user: User }) {
    return (
        <Layout user={user}>
            <div className="flex-grow px-6 pt-6">
                <h1 className="mb-7 text-2xl font-bold text-amber-950">Find some new locations to hang out with your furriends!</h1>
            </div>
            <div className="flex flex-grow items-center justify-center px-9 pt-3">
                <Map />
            </div>
            <BusinessForm />
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