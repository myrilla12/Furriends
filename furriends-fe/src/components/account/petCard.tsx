// card component showing pet photo (scrollable), overlayed with name, breed, age in the bottom left
import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button } from '@mantine/core';
import PetDetailsModal from '@/components/account/petDetailsModal';
import { PencilIcon } from '@heroicons/react/24/outline';

type PetCardProps = {
    pet: {
        name: string;
        type: string;
        breed: string;
        weight: number;
        birthday: string;
        energy_level: string;
        description: string;
        likes: string
        photos: string[];
    };
};

export default function PetCard({ pet }: PetCardProps) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <div
                className="relative bg-cover bg-center h-64 w-full rounded-lg overflow-hidden shadow-lg cursor-pointer"
                style={{ backgroundImage: `url(${pet.photos[0]})` }}
                onClick={open}
            >
                <div className="absolute bottom-0 left-0 pl-5 pb-4 text-white mix-blend-difference">
                    <h2 className="text-2xl font-bold">{pet.name}</h2>
                    <p>{pet.type},{" "}{pet.breed}</p>
                    <p className="text-sm">
                        {/* calculate age from birthday */}
                        {(new Date().getFullYear() - new Date(pet.birthday).getFullYear()).toString()}
                        {" "}years old
                    </p>
                </div>
                <div className="absolute top-0 right-0 pr-2 pt-2 mix-blend-difference">
                    <Button variant="subtle" size="compact-xs"
                        onClick={(e) => {e.stopPropagation()}}> {/*onClick={() => setModalOpened(true)}*/}
                        <PencilIcon className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <PetDetailsModal opened={opened} onClose={close} pet={pet} />
        </>
    );
};