// card component showing pet photo (scrollable), overlayed with name, breed, age in the bottom left
import { useState } from 'react';
import Image from 'next/image';
import PetDetailsModal from './petDetailsModal';

type PetCardProps = {
    pet: {
        id: string;
        name: string;
        breed: string;
        age: number;
        description: string;
        likes: string;
    };
    photos: { photo_url: string }[];
}

export default function PetCard({ pet, photos }: PetCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // when the card is clicked, the pet details modal opens
    const handleCardClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div
                key={pet.id}
                className="relative h-48 w-full bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                onClick={handleCardClick}
            >
                <div className="flex overflow-x-scroll h-full">
                    {photos.map((photo) => (
                        <div key={photo.photo_url} className="relative h-full w-full flex-shrink-0">
                            <Image src={photo.photo_url} alt={pet.name} layout="fill" objectFit="cover" />
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black via-transparent to-transparent text-white">
                    <h2 className="text-lg font-bold">{pet.name}</h2>
                    <p>{pet.age} years old</p>
                    <p>{pet.breed}</p>
                </div>
            </div>

            <PetDetailsModal pet={pet} photos={photos} isOpen={isModalOpen} onClose={handleModalClose} />
        </div>
    );
}