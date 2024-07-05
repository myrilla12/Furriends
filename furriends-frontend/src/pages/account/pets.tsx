import { useCallback, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Button } from '@mantine/core';
import type { User } from '@supabase/supabase-js'
import { createClient } from '../../utils/supabase/server-props'
import PetForm from '@/components/account/petForm';
import PetCard from '@/components/account/petCard';
import type { GetServerSidePropsContext } from 'next'
import { Pet } from '@/utils/definitions';

interface RawPetPhoto {
    photo_url: string;
}

// raw pet type for pet data that has just been extracted using a join
interface RawPet {
    id: number;
    owner_id: number;
    name: string;
    type: string;
    breed: string;
    weight: number;
    birthday: string;
    energy_level: number;
    description: string;
    likes: number;
    pet_photos: RawPetPhoto[];
}

type PetsPageProps = {
    user: User,
    pets: Pet[];
};

export default function PetsPage({ pets, user }: PetsPageProps) {
    const [petList, setPetList] = useState(pets);
    const [modalOpened, setModalOpened] = useState(false);

    const addPetToState = useCallback((newPet: Pet) => {
        setPetList((prevPets) => [...prevPets, newPet]);
    }, []);

    return (
        <Layout user={user}>
            <div className="flex-grow p-6">
                <h1 className="mb-7 text-2xl font-bold text-amber-950">My Pets</h1>
                <Button variant="light" color="#6d543e" onClick={() => setModalOpened(true)}>Add a pet</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6 px-6">
                {petList.map((pet) => (
                    <PetCard key={pet.id} pet={pet} editable={true} chattable={false} />
                ))}
            </div>
            <div className="flex flex-grow">
                <PetForm modalOpened={modalOpened} setModalOpened={setModalOpened} user={user} addPetToState={addPetToState} />
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
        .select('id, owner_id, name, type, breed, weight, birthday, energy_level, description, likes, pet_photos (photo_url)')
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
    const petsWithPhotoUrlArray = petData.map((pet: RawPet) => {
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