// deletes pet profiles from db on click
import { useState } from 'react';
import { Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Pet } from '@/utils/definitions';
import { createClient } from '../../../../furriends-backend/utils/supabase/component';

type PetDeleteModalProps = {
    opened: boolean;
    onClose: () => void;
    pet: Pet
}

export default function PetDeleteModal({ opened, onClose, pet }: PetDeleteModalProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);

    async function deletePet() {
        try {
            setLoading(true);
            const { error } = await supabase.from('pets').delete().eq('id', pet.id);
            if (error) throw error;
            alert(`${pet.name} removed from profile!`);
        } catch (error) {
            alert('Error removing pet!');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Modal opened={opened} onClose={onClose} title="Warning!" centered>
                <p className="font-bold text-red-600">Are you sure you want to remove {pet.name} from your profile?</p>
                <div className="flex justify-end">
                    <Button variant="light" color="rgba(217, 0, 0, 1)" className="mr-2"
                        onClick={async () => {
                            await deletePet();
                            onClose(); // close modal upon deletion
                        }}
                        disabled={loading} // button shows loading while data is deleted
                    >
                        {loading ? 'Deleting...' : 'Yes, I am sure'}
                    </Button>
                </div>
            </Modal>
        </>
    )
}