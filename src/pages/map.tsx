import React from 'react';
import Map from '@/components/map/map';
import Layout from '@/components/layout';
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'
import BusinessForm from '@/components/map/businessForm';
import Legend from '@/components/map/legend';
import Head from 'next/head';

type MapProps = {
    user: User;
};

/**
 * The Map page that allows users to find new locations
 * to hang out with their pets. It includes a map and a layout component.
 *
 * @param {Object} props - The component props.
 * @param {User} props.user - The user object.
 * @returns {JSX.Element} The rendered Map page.
 */
export default function MapPage({ user }: MapProps) {
    return (
        <Layout user={user}>
            <Head>
                <title>furriends | map</title>
                <meta name="Map page" content="This is the map page of furriends."></meta>
            </Head>
            <div className="flex flex-grow items-center px-6 pt-6 ">
                <h1 className="text-2xl font-bold text-amber-950 md:text-left break-words">Find some new locations to hang out with your furriends!</h1>
            </div>
            <div className="flex flex-grow items-center justify-center mx-4 md:mx-7 pt-4 w-fill">
                    <Map user={user} />
            </div>
            <div className="px-4 md:px-9 w-full">
                <Legend />
            </div>
            <BusinessForm />
        </Layout >
    )
}

/**
 * Fetch user location and limit unauthorised access by getting server props.
 *
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<{ props: { user: User } }>} The user data to be passed as props.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context);

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