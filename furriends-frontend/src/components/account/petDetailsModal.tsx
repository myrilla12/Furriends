// modal that opens on click to show stored pet details
import { Modal, Text, ScrollArea, Title } from '@mantine/core';
import Image from 'next/image';
import { Pet } from '@/utils/definitions';
import { calculateAge, getAgeString } from '@/utils/calculateAge';


type PetDetailsModalProps = {
    opened: boolean;
    onClose: () => void;
    pet: Pet;
}

/**
 * Modal component that displays detailed information about a pet.
 *
 * @param {PetDetailsModalProps} props - The component props.
 * @param {boolean} props.opened - Indicates whether the modal is open.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {Pet} props.pet - The pet object with detailed information.
 * @returns {JSX.Element} The pet details modal component.
 */
export default function PetDetailsModal({ pet, opened, onClose }: PetDetailsModalProps) {
    return (
        <Modal opened={opened} onClose={onClose} title={(<Title order={3}>{pet.name}</Title>)} scrollAreaComponent={ScrollArea.Autosize} size='lg' centered>
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
                <Text><strong>Birthday:</strong> {pet.birthday} ({getAgeString(calculateAge(pet))})</Text>
                <Text><strong>Energy Level:</strong> {pet.energy_level}</Text>
                <Text><strong>Description:</strong> {pet.description}</Text>
                <Text><strong>Likes:</strong> {pet.likes}</Text>
            </div>
        </Modal>
    );
}