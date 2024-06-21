// card component showing pet photo (scrollable), overlayed with name, type, breed, age in the bottom left
// pencil button in top right allows users to edit their pet profile
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '../../../../furriends-backend/utils/supabase/component';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, Button, Text } from '@mantine/core';
import PetDetailsModal from '@/components/account/petDetailsModal';
import PetEditModal from '@/components/account/petEditModal';
import PetDeleteModal from '@/components/account/petDeleteModal';
import { PencilIcon, TrashIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { Pet } from '@/utils/definitions';
import { calculateAge } from '@/utils/calculateAge';


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
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // create a memoized getCardPhoto; only recreated if dependencies change
    // get the first pet photo in the array to act as pet card photo
    const getCardPhoto = useCallback(async () => {
        if (pet.photos && pet.photos.length > 0) {
            await downloadImage(pet.photos[0]);
        }

        async function downloadImage(path: string) {
            try {
                const { data } = await supabase.storage
                    .from('pet_photos')
                    .getPublicUrl(path);
                setPhotoUrl(data.publicUrl);
            } catch (error) {
                console.log('Error downloading image: ', error);
            } finally {
                setLoading(false);
            }
        }
    }, [pet.photos, supabase]);

    useEffect(() => { getCardPhoto() }, [pet.photos, getCardPhoto]);

    return (
        <>
            <div
                className="relative bg-cover bg-center h-64 w-full rounded-lg overflow-hidden shadow-lg cursor-pointer"
                style={{ backgroundImage: `url(${pet.photos && photoUrl})` }}
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
                            }}>
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
                    <Button variant="light" color="rgba(0, 0, 0, 1)" size="sm" m='md'
                        onClick={() => console.log("Go to chat feature")}
                    >
                        <Text size='lg' fw={700} mr='xs'>Chat</Text>
                        <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
                    </Button>
                )}

            </div>
            <PetDetailsModal opened={detailsOpened} onClose={closeDetails} pet={pet} />
            <PetEditModal opened={editOpened} onClose={closeEdit} pet={pet} />
            <PetDeleteModal opened={deleteOpened} onClose={closeDelete} pet={pet} />
        </>
    );
};