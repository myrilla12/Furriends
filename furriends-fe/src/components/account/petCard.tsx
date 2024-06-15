// card component showing pet photo (scrollable), overlayed with name, breed, age in the bottom left
import React, { useState } from 'react';
import PetDetailsModal from '@/components/account/petDetailsModal';
import { Pet } from '@/util/definitions';

type PetCardProps = {
    pet: Pet;
};

export default function PetCard({ pet }: PetCardProps) {
    const [modalOpened, setModalOpened] = useState(false);

    return (
        <div
            className="relative bg-cover bg-center h-64 w-full rounded-lg overflow-hidden shadow-lg cursor-pointer"
            style={{ backgroundImage: `url(${pet.photos && pet.photos[0]})` }}
            onClick={() => setModalOpened(true)}
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
            <div className="flex flex-grow">
                <PetDetailsModal modalOpened={modalOpened} setModalOpened={setModalOpened} pet={pet} />
            </div>
        </div>
    );
};