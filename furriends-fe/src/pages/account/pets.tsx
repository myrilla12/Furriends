import { useCallback, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Button } from '@mantine/core';
import type { User } from '@supabase/supabase-js'
import { createClient } from '../../../../furriends-backend/utils/supabase/server-props'
import PetForm from '@/components/account/petForm';
import PetCard from '@/components/account/petCard';
import type { GetServerSidePropsContext } from 'next'
import { Pet } from '@/utils/definitions';

type MyPetsPageProps = {
    user: User,
    pets: Pet[];
};

export default function MyPetsPage({ pets, user }: MyPetsPageProps) {
    const [petList, setPetList] = useState(pets);
    const [modalOpened, setModalOpened] = useState(false);

    return (
        <Layout user={user}>
            <div className="flex-grow p-6">
                <h1 className="mb-7 text-2xl font-bold">My Pets</h1>
                <Button variant='default' color="gray" onClick={() => setModalOpened(true)}>Add a pet</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6 px-6">
                {petList.map((pet) => (
                    <PetCard key={pet.id} pet={pet} editable={true} />
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

    // select all pets & photos linked to the user's id
    const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('id, owner_id, name, type, breed, weight, birthday, energy_level, description, likes, created_at, pet_photos (photo_url)')
        .eq('owner_id', data.user.id);

    // if error, there are no pets
    if (petError) {
        return {
            props: {
                pets: [],
                user: data.user,
            },
        };
    }

    // ensure photos attribute is a string[] (array of urls)
    // by default after query it is an array of photo containing photo_url
    const petsWithPhotoUrlArray = petData.map(pet => {
        const photoUrls = pet.pet_photos.map(photo => photo.photo_url);
    
        return {
            ...pet,
            photos: photoUrls.filter(url => url !== null), // reassign the list of photo URLs, filtering away nulls
        };
    });
    
    return {
        props: {
            pets: petsWithPhotoUrlArray,
            user: data.user,
        },
    };
}
    
/* kept as reference code for now on how to map & sign urls; delete later!!!
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
        },
    }
*/