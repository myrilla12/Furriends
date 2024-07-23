// modal that pops up when "add a pet" button is clicked in profile page
// allows user to create and add a new pet profile
'use client'

import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, Modal, TextInput, Textarea, NumberInput, Select, ScrollArea } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import FileUpload from './fileUpload';
import { createClient } from '@/utils/supabase/component';
import { type User } from '@supabase/supabase-js';
import { Pet } from '@/utils/definitions';
import '@mantine/dates/styles.css'

type PetFormProps = {
    modalOpened: boolean;
    setModalOpened: (open: boolean) => void;
    user: User | null;
    addPetToState: (newPet: Pet) => void;
}

/**
 * Modal component for creating and adding a new pet profile.
 *
 * @param {PetFormProps} props - The component props.
 * @param {boolean} props.modalOpened - Indicates whether the modal is open.
 * @param {function} props.setModalOpened - Callback function to set the modal open state.
 * @param {User | null} props.user - The user object.
 * @param {function} props.addPetToState - Callback function to add the new pet to the state.
 * @returns {JSX.Element} The pet form modal component.
 */
export default function PetForm({ modalOpened, setModalOpened, user, addPetToState }: PetFormProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [breed, setBreed] = useState<string>('');
    const [weight, setWeight] = useState<number | null>(null);
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [energy_level, setEnergy] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [likes, setLikes] = useState<string | null>(null);
    const [photo_urls, setPhotoUrls] = useState<string[] | null>(null);

    // add getProfile using useCallBack here when implementing "edit" button, to allow code reusability

    /**
     * Adds a new pet profile to the database and state.
     *
     * @async
     * @function addPetProfile
     * @param {Object} petProfile - The pet profile data.
     * @param {string} petProfile.name - The name of the pet.
     * @param {string} petProfile.type - The type of the pet.
     * @param {string} petProfile.breed - The breed of the pet.
     * @param {number | null} petProfile.weight - The weight of the pet.
     * @param {Date | null} petProfile.birthday - The birthday of the pet.
     * @param {string | null} petProfile.energy_level - The energy level of the pet.
     * @param {string | null} petProfile.description - The description of the pet.
     * @param {string | null} petProfile.likes - The likes of the pet.
     * @param {string[] | null} petProfile.photo_urls - The photo URLs of the pet.
     */
    async function addPetProfile({ name, type, breed, weight, birthday, energy_level, description, likes, photo_urls }: {
        name: string 
        type: string 
        breed: string
        weight: number | null
        birthday: Date | null
        energy_level: string | null
        description: string | null
        likes: string | null
        photo_urls: string[] | null
    }) {

        // update relations in supabase with info, else throw error
        try {
            setLoading(true);
            const birthdayString = birthday ? dayjs(birthday).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');

            // insert into `pets` relation
            const { data, error } = await supabase
                .from('pets')
                .insert({
                    owner_id: user?.id as string,
                    name: name,
                    type: type,
                    breed: breed,
                    weight: weight,
                    birthday: birthdayString,
                    energy_level: energy_level,
                    description: description,
                    likes: likes,
                })
                .select('id, owner_id, birthday') // select the pet_id for insertion into pet_photos
                .single(); // expecting a single row
            if (error) throw error;

            const pet_id = data.id;

            // insert into `pet_photos` relation - each url creates a new row
            if (photo_urls && photo_urls.length > 0) {
                const photoInserts = photo_urls.map(photo_url => ({ pet_id, photo_url }));

                const { error: photoError } = await supabase
                    .from('pet_photos')
                    .insert(photoInserts);
                if (photoError) throw photoError;
            }
            
            const newPet = {
                id: pet_id,
                name: name,
                owner_id: data.owner_id,
                type: type,
                breed: breed,
                weight: weight,
                birthday: birthdayString,
                energy_level: energy_level,
                description: description,
                likes: likes,
                photos: photo_urls
            };

            addPetToState(newPet);
            alert('Pet added!');
        } catch (error) {
            alert('Unable to add pet!');
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

    // modal contains name, type, breed, weight, bday, energy level, description, likes, photo upload fields
    // name, type, breed, age are mandatory fields
    return (
        <Modal
            opened={modalOpened}
            onClose={() => {
                setModalOpened(false);
                setName('');
                setType('');
                setBreed('');
                setWeight(null);
                setBirthday(null);
                setEnergy(null);
                setDescription(null);
                setLikes(null);
                setPhotoUrls(null);
            }}
            title={<span className="font-bold text-lg text-brown">Create pet profile</span>}
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
                    uid={user?.id ?? null}
                    urls={photo_urls}
                    onUpload={(urls: string[]) => {
                        setPhotoUrls(urls)
                    }}
                />
                <Button variant="outline" color="#6d543e"
                    onClick={async () => {
                        if (validateForm()) {
                            await addPetProfile({ name, type, breed, weight, birthday, energy_level, description, likes, photo_urls });
                            setModalOpened(false); // close modal upon addition of pet
                            // reset all fields to prepare modal for next addition
                            setName('');
                            setType('');
                            setBreed('');
                            setWeight(null);
                            setBirthday(null);
                            setEnergy(null);
                            setDescription(null);
                            setLikes(null);
                            setPhotoUrls(null);
                        }
                    }}
                    disabled={loading} // button shows loading while data is uploaded
                >
                    {loading ? 'Loading...' : 'Add'}
                </Button>
            </div>
        </Modal>
    );
}