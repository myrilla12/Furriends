// modal that opens on click to show stored pet details
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '../../../../furriends-backend/utils/supabase/component';
import { Modal, Text, ScrollArea } from '@mantine/core';
import Image from 'next/image';
import { Pet } from '@/utils/definitions';
import { calculateAge } from '@/utils/calculateAge';


type PetDetailsModalProps = {
    opened: boolean;
    onClose: () => void;
    pet: Pet;
}

export default function PetDetailsModal({ pet, opened, onClose }: PetDetailsModalProps) {
    const supabase = createClient();
    const age = calculateAge(pet);
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // create a memoized getPetPhotos; only recreated if dependencies change
    const getPetPhotos = useCallback(async () => {
        if (pet.photos && pet.photos.length > 0) {
            const urls = await Promise.all(pet.photos.map(path => downloadImage(path)));
            setPhotoUrls(urls.filter(url => url !== '')); // filter out empty strings
            setLoading(false);
        }

        async function downloadImage(path: string) {
            try {
                const { data } = await supabase.storage
                    .from('pet_photos')
                    .getPublicUrl(path);
                return data.publicUrl;
            } catch (error) {
                console.log('Error downloading image: ', error);
                return '';
            }
        }
    }, [pet.photos, supabase]);

    useEffect(() => { getPetPhotos() }, [pet.photos, getPetPhotos]);

    return (
        <Modal opened={opened} onClose={onClose} title={pet.name} scrollAreaComponent={ScrollArea.Autosize} size='lg' centered>
            <div className="space-y-4">

                <div className="flex space-x-4">
                    {pet.photos && photoUrls.map((url, index) => (
                        <div key={index} className="relative w-44 h-44">
                            <Image
                                src={url}
                                alt={pet.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 33vw"
                                className="rounded object-cover"
                            />
                        </div>
                    ))}
                </div>

                <Text><strong>Type:</strong> {pet.type}</Text>
                <Text><strong>Breed:</strong> {pet.breed}</Text>
                <Text><strong>Birthday:</strong> {pet.birthday}</Text>
                <Text><strong>Weight:</strong> {pet.weight}{pet.weight ? " kg" : ""}</Text>
                <Text><strong>Age:</strong> {age} {age == 1 ? "year old" : "years old"}</Text>
                <Text><strong>Energy Level:</strong> {pet.energy_level}</Text>
                <Text><strong>Description:</strong> {pet.description}</Text>
                <Text><strong>Likes:</strong> {pet.likes}</Text>
            </div>
        </Modal>
    );
}