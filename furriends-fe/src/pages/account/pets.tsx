import { useCallback, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Button } from '@mantine/core';
import type { User } from '@supabase/supabase-js'
import { createClient } from '../../../../furriends-backend/utils/supabase/server-props'
import PetForm from '@/components/account/petForm';
import PetCard from '@/components/account/petCard';
import type { GetServerSidePropsContext } from 'next'

type MyPetsPageProps = {
    avatarUrl: string;
    user: User,
    pets: {
        id: string;
        name: string;
        type: string;
        breed: string;
        weight: number;
        birthday: string;
        energy_level: string;
        description: string;
        likes: string
        photos: string[];
    }[];
};

export default function MyPetsPage({ avatarUrl, pets, user }: MyPetsPageProps) {
    const [petList, setPetList] = useState(pets);
    const [modalOpened, setModalOpened] = useState(false);

    return (
        <Layout avatarUrl={avatarUrl}>
            <div className="flex-grow p-6">
                <h1 className="mb-8 text-2xl font-bold">My Pets</h1>
                <Button variant='default' color="gray" onClick={() => setModalOpened(true)}>Add a pet</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6 px-6">
                {petList.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                ))}
            </div>
            <div className="flex flex-grow">
                <PetForm modalOpened={modalOpened} setModalOpened={setModalOpened} user={user} />
            </div>
        </Layout>
    );
}


// fetch user profile photo & pet profile by getting server props
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

    // get user profile photo
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, avatar_url')
        .eq('id', data.user.id)
        .single();

    // generate signed url linking to profile photo
    let signedAvatarUrl = '';

    if (profileData && profileData.avatar_url) {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('avatars')
            .createSignedUrl(profileData.avatar_url, 3600);

        if (!signedUrlError && signedUrlData) {
            signedAvatarUrl = signedUrlData.signedUrl;
        }
    }

    // select all pets & photos linked to the user's id
    const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('id, name, type, breed, weight, birthday, energy_level, description, likes, pet_photos (photo_url)')
        .eq('owner_id', data.user.id);

    // if error, there are no pets
    if (petError) {
        return {
            props: {
                pets: [],
                user: data.user,
                avatarUrl: signedAvatarUrl,
            },
        };
    }

    // replace photo url with signed link to correct item in supabase storage
    const petsWithPhotoUrls = await Promise.all(petData.map(async pet => {
        const signedPhotos = await Promise.all(pet.pet_photos.map(async photo => {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from('pet_photos')
                .createSignedUrl(photo.photo_url, 3600);

            if (signedUrlError || !signedUrlData) {
                return null;
            }

            return signedUrlData.signedUrl;
        }));

        return {
            ...pet,
            photos: signedPhotos.filter(url => url !== null), // Filter out any null values
        };
    }));

    return {
        props: {
            pets: petsWithPhotoUrls,
            user: data.user,
            avatarUrl: signedAvatarUrl,
        },
    }
}