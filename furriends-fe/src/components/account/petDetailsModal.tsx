// modal that opens on click to show stored pet details
import { Modal, Text, ScrollArea } from '@mantine/core';
import Image from 'next/image'

type PetDetailsModalProps = {
    modalOpened: boolean;
    setModalOpened: (open: boolean) => void;
    pet: {
        name: string;
        breed: string;
        birthday: string
        description: string;
        likes: string,
        photos: string[];
    };
}

export default function PetDetailsModal({ pet, modalOpened, setModalOpened }: PetDetailsModalProps) {
    return (
        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title={pet.name} scrollAreaComponent={ScrollArea.Autosize}>
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
                <Text><strong>Breed:</strong> {pet.breed}</Text>
                <Text><strong>Birthday:</strong> {pet.birthday}</Text>
                <Text><strong>Age:</strong>{" "}
                    {/* calculate age from birthday */}
                    {(new Date().getFullYear() - new Date(pet.birthday).getFullYear()).toString()}
                    {" "}years old
                </Text>
                <Text><strong>Description:</strong> {pet.description}</Text>
                <Text><strong>Likes:</strong> {pet.likes}</Text>
            </div>
        </Modal>
    );
}