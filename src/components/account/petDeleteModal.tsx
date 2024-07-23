// warning modal with button allowing users to delete pet from profile
import { useState } from 'react';
import { Modal, Button } from '@mantine/core';
import { Pet } from '@/utils/definitions';
import { createClient } from '../../utils/supabase/component';

type PetDeleteModalProps = {
    opened: boolean;
    onClose: () => void;
    pet: Pet
    deletePetFromState: (deletedPetId: string) => void;
}

/**
 * Modal component for deleting a pet from the profile.
 *
 * @param {PetDeleteModalProps} props - The component props.
 * @param {boolean} props.opened - Indicates whether the modal is open.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {Pet} props.pet - The pet object to be deleted.
 * @param {function} props.deletePetFromState - Callback function to delete the pet from the state.
 * @returns {JSX.Element} The pet delete modal component.
 */
export default function PetDeleteModal({ opened, onClose, pet, deletePetFromState }: PetDeleteModalProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    /**
     * Deletes the pet from the database and updates the state.
     *
     * @async
     * @function deletePet
     */
    async function deletePet() {
        try {
            setLoading(true);
            const { error } = await supabase.from('pets').delete().eq('id', pet.id);
            if (error) throw error;
            deletePetFromState(pet.id);
            alert(`${pet.name} removed from profile!`);
        } catch (error) {
            alert('Error removing pet!');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Modal opened={opened} onClose={onClose} title={<span className="font-bold text-lg text-red-600">Warning!</span>} size="auto" centered>
                <p className="font-bold text-red-600">
                    Are you sure you want to remove <span className="underline">{pet.name}</span> from your profile?</p>
                <p className="text-red-600 pt-2">This action is irreversible.</p>
                <div className="flex justify-end">
                    <Button variant="light" color="rgba(217, 0, 0, 1)" className="mr-1"
                        onClick={async () => {
                            await deletePet();
                            onClose(); // close modal upon deletion
                        }}
                        disabled={loading} // button shows loading while data is deleted
                    >
                        {loading ? 'Deleting...' : 'Yes, I am sure.'}
                    </Button>
                </div>
            </Modal>
        </>
    )
}