// card component showing pet photo (scrollable), overlayed with name, type, breed, age in the bottom left
// pencil button in top right allows users to edit their pet profile
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '../../../../furriends-backend/utils/supabase/component';
import { useDisclosure } from '@mantine/hooks';
import { Button } from '@mantine/core';
import PetDetailsModal from '@/components/account/petDetailsModal';
import PetEdit from '@/components/account/petEdit';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Pet } from '@/utils/definitions';

type PetCardProps = {
    pet: Pet;
    editable: boolean;
};

export default function PetCard({ pet, editable }: PetCardProps) {
    const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false); // controls opening/closing of petDetailsModal
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false); // controls opening/closing of petEdit modal

    return (
        <>
            <div
                className="relative bg-cover bg-center h-64 w-full rounded-lg overflow-hidden shadow-lg cursor-pointer"
                style={{ backgroundImage: `url(${pet.photos && pet.photos[0]})` }}
                onClick={openDetails}
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

                {editable && (
                    <div className="absolute top-0 right-0 pr-2 pt-2 mix-blend-difference">
                        <Button variant="subtle" size="compact-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit();
                          }}>
                          <PencilIcon className="h-5 w-5" />
                        </Button>
                        <Button variant="subtle" size="compact-xs"
                            onClick={(e) => {
                                e.stopPropagation() }}>
                            <TrashIcon className="h-5 w-5" />
                        </Button>
                    </div>
                )}
                
            </div>
            <PetDetailsModal opened={detailsOpened} onClose={closeDetails} pet={pet} />
            <PetEdit opened={editOpened} onClose={closeEdit} pet={pet} />
        </>
    );
};