// modal that opens on click to show stored pet details
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
    const age = calculateAge(pet);

    return (
        <Modal opened={opened} onClose={onClose} title={pet.name} scrollAreaComponent={ScrollArea.Autosize} size='lg'>
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