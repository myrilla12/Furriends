import { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Button } from '@mantine/core';
import { createClient } from '../../../../furriends-backend/utils/supabase/server-props'
import PetForm from '@/components/account/petForm';
import PetCard from '@/components/account/petCard';
import type { GetServerSidePropsContext } from 'next'

const supabase = createClient();

type MyPetsPageProps = {
    avatarUrl: string;
};

export default function MyPetsPage({ avatarUrl }: MyPetsPageProps) {
    const [pets, setPets] = useState([]);
    const [photos, setPhotos] = useState<{ [key: string]: { photo_url: string }[] }>({});
    const [modalOpened, setModalOpened] = useState(false);

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        const { data, error } = await supabase.from('pets').select('*').eq('owner_id', supabase.auth.user()?.id);
        if (error) {
            console.error(error);
        } else {
            setPets(data);
            data.forEach(pet => fetchPhotos(pet.id));
        }
    };

    const fetchPhotos = async (petId: string) => {
        const { data, error } = await supabase.from('pet_photos').select('*').eq('pet_id', petId);
        if (error) {
            console.error(error);
        } else {
            setPhotos(prevPhotos => ({ ...prevPhotos, [petId]: data }));
        }
    };

    const handlePetAdded = (pet: any) => {
        setPets([...pets, pet]);
        fetchPhotos(pet.id); // Fetch photos for the newly added pet
    };

    return (
        <Layout avatarUrl={avatarUrl}>
            <div className="flex-grow p-6">
                <h1 className="mb-8 text-2xl font-bold">My Pets</h1>
                <Button variant='default' color="gray" onClick={() => setModalOpened(true)}>Add a pet</Button>
            </div>
            <div className="flex-grow px-6">
                <p>Here are my pets</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} photos={photos[pet.id] || []} />
                ))}
            </div>

            <PetForm modalOpened={modalOpened} setModalOpened={setModalOpened} onPetAdded={handlePetAdded} />
        </Layout>
    );
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

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', data.user.id)
        .single();

    // generate signed url linking to correct item is supabase storage bucket
    let signedAvatarUrl = '';

    if (profileData && profileData.avatar_url) {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('avatars')
            .createSignedUrl(profileData.avatar_url, 600);

        if (!signedUrlError && signedUrlData) {
            signedAvatarUrl = signedUrlData.signedUrl;
        }
    }

    return {
        props: {
            user: data.user,
            avatarUrl: signedAvatarUrl,
        },
    }
}