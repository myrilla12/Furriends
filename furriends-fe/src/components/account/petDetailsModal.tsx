// modal that opens on click to show stored pet details
import { Modal, Text, Image } from '@mantine/core';

type PetDetailsModalProps = {
    pet: {
        name: string;
        breed: string;
        age: number;
        description: string;
        likes: string,
    };
    photos: { photo_url: string }[];
    isOpen: boolean;
    onClose: () => void;
}

export default function PetDetailsModal({ pet, photos, isOpen, onClose }: PetDetailsModalProps) {
    return (
        <Modal opened={isOpen} onClose={onClose} title={pet.name}>
            <div className="space-y-4">
                <div className="flex space-x-4">
                    {photos.map((photo) => ( // display all the photos of this pet
                        <Image key={photo.photo_url} src={photo.photo_url} alt={pet.name} width={100} height={100} />
                    ))}
                </div>
                <Text><strong>Age:</strong> {pet.age} years old</Text>
                <Text><strong>Breed:</strong> {pet.breed}</Text>
                <Text><strong>Description:</strong> {pet.description}</Text>
                <Text><strong>Hobbies:</strong> {pet.likes}</Text>
            </div>
        </Modal>
    );
}