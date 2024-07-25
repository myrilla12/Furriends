import { useState, useEffect } from 'react';
import { parseCookies, destroyCookie } from 'nookies';
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'
import type { User } from '@supabase/supabase-js'
import { Pet } from '@/utils/definitions';
import Layout from '@/components/layout';
import Filters from '@/components/dashboard/filters';
import PetCarousel from '@/components/dashboard/petCarousel';
import LocationModal from '@/components/dashboard/locationModal';
import NoPetsFound from '@/components/dashboard/noPetsFound';
import Head from 'next/head';

/**
 * Props for the DashboardPage component.
 * @typedef {Object} DashboardProps
 * @property {User} user - The authenticated user.
 * @property {string} username - The username of the user.
 * @property {React.ReactNode} children - Children components to render within the layout.
 * @property {Pet[]} pets - Array of pet objects.
 * @property {boolean} showLocationModal - Flag to indicate if the location modal should be shown.
 */
type DashboardProps = {
    user: User;
    username: string;
    children: React.ReactNode;
    pets: Pet[];
    showLocationModal: boolean;
};

/**
 * The DashboardPage component for displaying the user's dashboard with pet filters and carousel.
 *
 * @param {DashboardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered DashboardPage component.
 */
export default function DashboardPage({ user, username, pets, children, showLocationModal }: DashboardProps) {
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(showLocationModal);
    const [filteredPets, setFilteredPets] = useState<Pet[]>(pets);

    useEffect(() => {
        if (showLocationModal) {
            setIsLocationModalOpen(true);
        }
    }, [showLocationModal]);

    return (
        <Layout user={user}>
            <Head>
                <meta name="Dashboard page" content="This is the dashboard page of furriends."></meta>
            </Head>
            <div className="flex-grow p-6 md:overflow-y-auto">
                <h1 className="mb-8 text-2xl">Welcome, <strong>{username || user.email || 'user'}</strong>!</h1>
                <h1 className="mb-8 text-2xl font-bold">
                    Find your pet some <span className='text-brown'>furriends</span>!
                </h1>

                <Filters pets={pets} setFilteredPets={setFilteredPets} />
                {filteredPets.length > 0 ? (<PetCarousel user={user} pets={filteredPets} />) : (<NoPetsFound />)}
                {children}
            </div>

            <LocationModal
                opened={isLocationModalOpen}
                onClose={() => {
                    setIsLocationModalOpen(false);
                    destroyCookie(null, 'showLocationModal', { path: '/' });
                }}
                user={user}
            />
        </Layout>
    );
}

/**
 * Fetches user data (username, profile photo) and pet data by getting server props.
 *
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<{ props: { user: User, username: string, pets: Pet[], showLocationModal: boolean } }>} The server-side props.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context);
    const cookies = parseCookies(context);

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
        .select('avatar_url, username')
        .eq('id', data.user.id)
        .single();

    // get pet data of pets that do not belong to current user
    const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('id, owner_id, name, type, breed, weight, birthday, energy_level, description, likes, pet_photos (photo_url)')
        .neq('owner_id', data?.user?.id)

    // if error, there are no other pets
    if (petError) {
        return {
            props: {
                pets: [],
                user: data.user,
                username: profileData?.username || '',
                showLocationModal: cookies.showLocationModal === 'true'
            },
        };
    }

    // ensure photos attribute is a string[] (array of urls)
    // by default after query it is an array of photo containing photo_url
    const petsWithPhotoUrlArray = petData.map((pet: { pet_photos: any[]; }) => {
        const photoUrls = pet.pet_photos.map(photo => photo.photo_url);

        return {
            ...pet,
            photos: photoUrls, // reassign the list of photo URLs
        };
    });

    return {
        props: {
            user: data.user,
            username: profileData?.username || '',
            pets: petsWithPhotoUrlArray,
            showLocationModal: cookies.showLocationModal === 'true'
        },
    };
}