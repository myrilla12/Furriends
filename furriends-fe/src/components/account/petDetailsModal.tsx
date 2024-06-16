// modal that opens on click to show stored pet details
// pencil button in bottom right allows users to edit their pet profile
import { Modal, Text, ScrollArea } from '@mantine/core';
import Image from 'next/image';


type PetDetailsModalProps = {
    opened: boolean;
    onClose: () => void;
    pet: {
        name: string;
        type: string;
        breed: string;
        weight: number;
        birthday: string;
        energy_level: string;
        description: string;
        likes: string,
        photos: string[];
    };
}

export default function PetDetailsModal({ pet, opened, onClose }: PetDetailsModalProps) {
    return (
        <Modal opened={opened} onClose={onClose} title={pet.name} scrollAreaComponent={ScrollArea.Autosize}>
            <div className="space-y-4">

                <div className="flex space-x-3">
                    {pet.photos.map((url, index) => (
                        <div key={index} className="relative w-32 h-32">
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
                <Text><strong>Age:</strong>{" "}
                    {/* calculate age from birthday */}
                    {(new Date().getFullYear() - new Date(pet.birthday).getFullYear()).toString()}
                    {" "}years old
                </Text>
                <Text><strong>Energy Level:</strong> {pet.energy_level}</Text>
                <Text><strong>Description:</strong> {pet.description}</Text>
                <Text><strong>Likes:</strong> {pet.likes}</Text>
            </div>
        </Modal>
    );
}