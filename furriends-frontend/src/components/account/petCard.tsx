// card component showing pet photo (scrollable), overlayed with name, type, breed, age in the bottom left
// pencil button in top right allows users to edit their pet profile
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button } from '@mantine/core';
import PetDetailsModal from '@/components/account/petDetailsModal';
import PetEditModal from '@/components/account/petEditModal';
import PetDeleteModal from '@/components/account/petDeleteModal';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Pet } from '@/utils/definitions';
import { calculateAge, getAgeString } from '@/utils/calculateAge';
import { calculateImageBrightness } from '@/utils/calculateImageBrightness';
import ChatButton from '@/components/chat/chatButton';


type PetCardProps = {
    pet: Pet;
    editable: boolean;
    chattable: boolean;
    updatePetInState?: (updatedPet: Pet) => void; // optional prop, only defined when pet card is editable
    deletePetFromState?: (deletedPetId: string) => void; // optional prop, only defined when pet card is editable
};

/**
 * Component for displaying a pet card with photo, name, type, breed, and age. 
 * Allows editing and deleting the pet profile if editable.
 *
 * @param {PetCardProps} props - The component props.
 * @param {Pet} props.pet - The pet object.
 * @param {boolean} props.editable - Indicates if the pet profile is editable.
 * @param {boolean} props.chattable - Indicates if the chat button should be displayed.
 * @param {function} [props.updatePetInState] - Callback function to update the pet in the state.
 * @param {function} [props.deletePetFromState] - Callback function to delete the pet from the state.
 * @returns {JSX.Element} The pet card component.
 */
export default function PetCard({ pet, editable, chattable, updatePetInState, deletePetFromState }: PetCardProps) {
    const [textColor, setTextColor] = useState('white');
    const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false); // controls opening/closing of petDetailsModal
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false); // controls opening/closing of petEdit modal
    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false); // controls opening/closing of petDeleteModal

    useEffect(() => {
        /**
         * Sets the text color based on the brightness of the pet's photo.
         * 
         * @async
         * @function setTextColorBasedOnImage
         */
        const setTextColorBasedOnImage = async () => {
            if (pet.photos && pet.photos[0]) {
                const brightness = await calculateImageBrightness(pet.photos[0]);
                setTextColor(brightness > 128 ? 'black' : 'white');
            } else {
                setTextColor('black')
            }
        };
        setTextColorBasedOnImage();
    }, [pet.photos]);

    return (
        <>
            <div
                className="relative bg-cover bg-center h-64 w-full rounded-lg overflow-hidden shadow-lg cursor-pointer"
                style={{ backgroundImage: `url(${pet.photos && pet.photos[0]})` }}
                onClick={openDetails}
            >
                <div className="absolute bottom-0 left-0 pl-5 pb-4" style={{ color: textColor }}>
                    <h2 className="text-2xl font-bold">{pet.name}</h2>
                    <p>{pet.type},{" "}{pet.breed}</p>
                    <p className="text-sm">{getAgeString(calculateAge(pet))}</p>
                </div>

                {editable && updatePetInState && deletePetFromState && (
                    <div className="absolute top-0 right-0 pr-2 pt-2">
                        <Button
                            variant="subtle"
                            size="compact-xs"
                            style={{ color: textColor }}
                            onClick={(e) => {
                                e.stopPropagation();
                                openEdit();
                            }}
                        >
                            <PencilIcon className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="subtle"
                            size="compact-xs"
                            style={{ color: textColor }}
                            onClick={(e) => {
                                e.stopPropagation();
                                openDelete();
                            }}>
                            <TrashIcon className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                <div className="absolute top-0 left-0 pl-2 pt-2">
                {chattable && (
                    <ChatButton owner_id={pet.owner_id} button_color={textColor} feed={false}/>
                )}
                </div>

            </div>
            <PetDetailsModal opened={detailsOpened} onClose={closeDetails} pet={pet} />

            {editable && updatePetInState && (
                <PetEditModal opened={editOpened} onClose={closeEdit} pet={pet} updatePetInState={updatePetInState} />
            )}

            {editable && deletePetFromState && (
                <PetDeleteModal opened={deleteOpened} onClose={closeDelete} pet={pet} deletePetFromState={deletePetFromState} />
            )}
        </>
    );
};