// modal that opens on click to show stored pet details
import { createClient } from '../../utils/supabase/component';
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
    const getAgeString = () => {
        const age = calculateAge(pet);
        let ageString = age + (age == 1 ? " year old" : " years old")
        if (age < 1) {
            const ageInMonths = Math.ceil(age * 12);
            ageString = ageInMonths + (ageInMonths == 1 ? " month old" : " months old")
        }
        return ageString;
    }

    return (
        <Modal opened={opened} onClose={onClose} title={pet.name} scrollAreaComponent={ScrollArea.Autosize} size='lg' centered>
            <div className="space-y-4">

                <div className="flex space-x-4">
                    {pet.photos && pet.photos.map((url, index) => (
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
                <Text><strong>Weight:</strong> {pet.weight}{pet.weight ? " kg" : ""}</Text>
                <Text><strong>Birthday:</strong> {pet.birthday} ({getAgeString()})</Text>
                <Text><strong>Energy Level:</strong> {pet.energy_level}</Text>
                <Text><strong>Description:</strong> {pet.description}</Text>
                <Text><strong>Likes:</strong> {pet.likes}</Text>
            </div>
        </Modal>
    );
}