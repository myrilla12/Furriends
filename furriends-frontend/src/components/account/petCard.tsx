// card component showing pet photo (scrollable), overlayed with name, type, breed, age in the bottom left
// pencil button in top right allows users to edit their pet profile
import { createClient } from '../../utils/supabase/component';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, Button, MantineColorsTuple, Text, createTheme } from '@mantine/core';
import PetDetailsModal from '@/components/account/petDetailsModal';
import PetEditModal from '@/components/account/petEditModal';
import PetDeleteModal from '@/components/account/petDeleteModal';
import { PencilIcon, TrashIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { Pet } from '@/utils/definitions';
import { calculateAge } from '@/utils/calculateAge';
import ChatButton from '../chat/chatButton';


type PetCardProps = {
    pet: Pet;
    editable: boolean;
    chattable: boolean;
};

export default function PetCard({ pet, editable, chattable }: PetCardProps) {
    const supabase = createClient();
    const age = calculateAge(pet);
    const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false); // controls opening/closing of petDetailsModal
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false); // controls opening/closing of petEdit modal
    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false); // controls opening/closing of petDeleteModal

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
                    <p className="text-sm">{age} {age == 1 ? "year old" : "years old"}</p>
                </div>

                {editable && (
                    <div className="absolute top-0 right-0 pr-2 pt-2 mix-blend-difference">
                        <Button variant="subtle" size="compact-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                openEdit();
                            }}
                        >
                            <PencilIcon className="h-5 w-5" />
                        </Button>
                        <Button variant="subtle" size="compact-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                openDelete();
                            }}>
                            <TrashIcon className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                {chattable && (
                    <ChatButton owner_id={pet.owner_id}/>
                )}

            </div>
            <PetDetailsModal opened={detailsOpened} onClose={closeDetails} pet={pet} />
            <PetEditModal opened={editOpened} onClose={closeEdit} pet={pet} />
            <PetDeleteModal opened={deleteOpened} onClose={closeDelete} pet={pet} />
        </>
    );
};