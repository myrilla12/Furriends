'use client'

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Modal, ScrollArea, Button, TextInput, Textarea, Select, NumberInput, Notification } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import FileUpload from './fileUpload';
import SortablePhotoArray from './sortablePhotoArray';
import { createClient } from '@/utils/supabase/component';
import { Pet } from '@/utils/definitions';
import '@mantine/dates/styles.css';

type PetEditModalProps = {
    opened: boolean;
    onClose: () => void;
    pet: Pet;
    updatePetInState: (updatedPet: Pet) => void;
}

/**
 * Modal component for editing pet details, autofilled with existing profile data.
 *
 * @param {PetEditModalProps} props - The component props.
 * @param {boolean} props.opened - Indicates whether the modal is open.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {Pet} props.pet - The pet object with existing profile data.
 * @param {function} props.updatePetInState - Callback function to update the pet in the state.
 * @returns {JSX.Element} The pet edit modal component.
 */
export default function PetEditModal({ opened, onClose, pet, updatePetInState }: PetEditModalProps) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string>(pet.name);
    const [type, setType] = useState<string>(pet.type);
    const [breed, setBreed] = useState<string>(pet.breed);
    const [weight, setWeight] = useState<number | null>(pet.weight);
    const [birthday, setBirthday] = useState<Date | null>(new Date(pet.birthday));
    const [energy_level, setEnergy] = useState<string | null>(pet.energy_level);
    const [description, setDescription] = useState<string | null>(pet.description);
    const [likes, setLikes] = useState<string | null>(pet.likes);
    const [photo_urls, setPhotoUrls] = useState<string[] | null>(pet.photos);
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (alertOpen) {
            timer = setTimeout(() => {
                setAlertOpen(false);
            }, 3000);  // closes alert after 3 seconds
        }

        return () => clearTimeout(timer); // clear timeout if component unmounts or alertOpen changes
    }, [alertOpen]);

    /**
     * Updates the pet profile in the database and state.
     *
     * @async
     * @function updatePetProfile
     */
    async function updatePetProfile() {
        // update relations in supabase with new info, else throw error
        try {
            setLoading(true);
            const birthdayString = birthday ? dayjs(birthday).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');

            // merge existing pet data with new values
            const updatedPet = {
                name,
                type,
                breed,
                weight,
                birthday: birthdayString,
                energy_level,
                description,
                likes
            };

            // insert pet data into `pets` relation
            const { data, error: dataError } = await supabase
                .from('pets')
                .update(updatedPet)
                .eq('id', pet.id)
                .select('birthday');
            if (dataError) throw dataError;

            // delete all entries in `pet_photos` linked to the pet id
            const { error: photoDeleteError } = await supabase
                .from('pet_photos')
                .delete()
                .eq('pet_id', pet.id);
            if (photoDeleteError) throw photoDeleteError;

            // re-insert photos to ensure they take on the new order, including any new photos while omitting deleted photos
            if (photo_urls && photo_urls.length > 0) {
                const photoInserts = photo_urls?.map((url) => ({
                    pet_id: pet.id,
                    photo_url: url,
                }));
                const { error: photoInsertError } = await supabase
                    .from('pet_photos')
                    .insert(photoInserts);
                if (photoInsertError) throw photoInsertError;
            }

            // include all other fields in Pet definition
            const fullUpdatedPet = {
                ...updatedPet,
                id: pet.id,
                owner_id: pet.owner_id,
                birthday: birthdayString,
                photos: photo_urls
            };

            updatePetInState(fullUpdatedPet);
            setAlertOpen(true);
            //alert('Pet profile updated!');
        } catch (error) {
            alert('Error updating the data!');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Validates the form to ensure all required fields are filled.
     *
     * @function validateForm
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     */
    // can be further refined to show error message below relevant fields instead of using alert
    const validateForm = () => {
        if (!name || !type || !breed || !birthday) {
            alert('Please fill in all required fields: Name, Type, Breed, and Birthday.');
            return false;
        }
        return true;
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => {
                    onClose();
                    setName(pet.name);
                    setType(pet.type);
                    setBreed(pet.breed);
                    setWeight(pet.weight);
                    setBirthday(new Date(pet.birthday));
                    setEnergy(pet.energy_level);
                    setDescription(pet.description);
                    setLikes(pet.likes);
                    setPhotoUrls(pet.photos);
                }}
                title={<span className="font-bold text-lg text-brown">{`Edit ${pet.name}'s pet profile`}</span>}
                centered
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <div className="space-y-4">
                    <TextInput
                        label="Name"
                        name="name"
                        placeholder="Name"
                        value={name || ''}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Select
                        label="Type"
                        name="type"
                        placeholder="Select type"
                        value={type || ''}
                        data={['Dog', 'Cat', 'Rabbit', 'Hamster', 'Bird', 'Turtle/Tortoise', 'Guinea Pig', 'Chinchilla', 'Other']}
                        onChange={(value: string | null) => setType(value || '')}
                        allowDeselect={false}
                        checkIconPosition="right"
                        required
                        searchable
                        nothingFoundMessage="Nothing found..."
                    />
                    <TextInput
                        label="Breed"
                        name="breed"
                        placeholder="Breed"
                        value={breed || ''}
                        onChange={(e) => setBreed(e.target.value)}
                        required
                    />
                    <NumberInput
                        label="Weight"
                        name="weight"
                        placeholder="Weight"
                        suffix=" kg"
                        value={weight || ''}
                        onChange={(value) => setWeight(value !== '' ? Number(value) : null)}
                        min={0}
                    />
                    <DatePickerInput
                        label="Birthday"
                        name="birthday"
                        placeholder="Select birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e)}
                        required
                    />
                    <Select
                        label="Energy Level"
                        name="energy"
                        placeholder="Select energy level"
                        value={energy_level || ''}
                        data={['Very Low', 'Low', 'Medium', 'High', 'Very High']}
                        onChange={setEnergy}
                        checkIconPosition="right"
                    />
                    <Textarea
                        label="Description"
                        name="description"
                        placeholder="Describe your pet"
                        value={description || ''}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Textarea
                        label="Likes"
                        name="likes"
                        placeholder="Add your pet's favourite items/activities!"
                        value={likes || ''}
                        onChange={(e) => setLikes(e.target.value)}
                    />
                    <FileUpload
                        uid={pet.owner_id}
                        urls={photo_urls}
                        onUpload={(urls: string[]) => {
                            setPhotoUrls(urls)
                        }}
                    />
                    <SortablePhotoArray photoUrls={photo_urls} setPhotoUrls={setPhotoUrls} />
                    <Button variant="outline" color="#6d543e"
                        onClick={async () => {
                            if (validateForm()) {
                                await updatePetProfile();
                                onClose(); // close modal upon update of pet details
                                // reset fields
                                setName(name);
                                setType(type);
                                setBreed(breed);
                                setWeight(weight);
                                setBirthday(birthday);
                                setEnergy(energy_level);
                                setDescription(description);
                                setLikes(likes);
                                setPhotoUrls(photo_urls);
                            }
                        }}
                        disabled={loading} // button shows loading while data is uploaded
                    >
                        {loading ? 'Loading...' : 'Update'}
                    </Button>
                </div>
            </Modal>

            {alertOpen && (
                <Notification
                    variant="light"
                    color="#6d543e"
                    withBorder
                    onClose={() => setAlertOpen(false)}
                    title="Pet profile updated!"
                    style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)' }}
                />
            )}
        </>
    );
}