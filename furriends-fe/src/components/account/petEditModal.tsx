// pet edit form allowing users to edit their pet details; autofilled with exisitng profile data
'use client'

import { useCallback, useEffect, useState } from 'react';
import { Modal, ScrollArea, Button, TextInput, Select, NumberInput, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import FileUpload from './fileUpload';
import SortablePhotoArray from './sortablePhotoArray';
import { createClient } from '../../../../furriends-backend/utils/supabase/component';
import { Pet } from '@/utils/definitions';
import '@mantine/dates/styles.css';

type PetEditModalProps = {
    opened: boolean;
    onClose: () => void;
    pet: Pet
}

export default function PetEditModal({ opened, onClose, pet }: PetEditModalProps) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string | null>(pet.name);
    const [type, setType] = useState<string | null>(pet.type);
    const [breed, setBreed] = useState<string | null>(pet.breed);
    const [weight, setWeight] = useState<number | null>(pet.weight);
    const [birthday, setBirthday] = useState<Date | null>(new Date(pet.birthday));
    const [energy_level, setEnergy] = useState<string | null>(pet.energy_level);
    const [description, setDescription] = useState<string | null>(pet.description);
    const [likes, setLikes] = useState<string | null>(pet.likes);
    const [photo_urls, setPhotoUrls] = useState<string[] | null>(pet.photos);

    async function updatePetProfile() {
        // update relations in supabase with new info, else throw error
        try {
            setLoading(true);
            let birthdayString = birthday ? birthday.toISOString() : new Date().toISOString();

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
            const { error: dataError } = await supabase.from('pets').update(updatedPet).eq('id', pet.id);
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

            alert('Pet profile updated!');
        } catch (error) {
            alert('Error updating the data!');
        } finally {
            setLoading(false);
        }
    }

    // form validation to ensure all required fields are filled
    // can be further refined to show error message below relevant fields instead of using alert
    const validateForm = () => {
        if (!name || !type || !breed || !birthday) {
            alert('Please fill in all required fields: Name, Type, Breed, and Birthday.');
            return false;
        }
        return true;
    };

    return (
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
            title={`Edit ${pet.name}'s pet profile`}
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
                    onChange={setType}
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
                <TextInput
                    label="Description"
                    name="description"
                    placeholder="Describe your pet"
                    value={description || ''}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextInput
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
                <Button variant="default" color="gray"
                    onClick={async () => {
                        if (validateForm()) {
                            await updatePetProfile();
                            onClose(); // close modal upon update of pet details
                            // reset fields
                            setName(pet.name);
                            setType(pet.type);
                            setBreed(pet.breed);
                            setWeight(pet.weight);
                            setBirthday(new Date(pet.birthday));
                            setEnergy(pet.energy_level);
                            setDescription(pet.description);
                            setLikes(pet.likes);
                            setPhotoUrls(pet.photos);
                        }
                    }}
                    disabled={loading} // button shows loading while data is uploaded
                >
                    {loading ? 'Loading...' : 'Update'}
                </Button>
            </div>
        </Modal>
    );
}