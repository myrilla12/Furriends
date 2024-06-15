// modal that pops up when "add a pet" button is clicked in profile page
// allows user to create and add a new pet profile
'use client'

import { useState } from 'react';
import { Button, Modal, TextInput, NumberInput, Select, ScrollArea } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import FileUpload from './fileUpload';
import { createClient } from '../../../../furriends-backend/utils/supabase/component';
import { type User } from '@supabase/supabase-js';
import '@mantine/dates/styles.css'

type PetFormProps = {
    modalOpened: boolean;
    setModalOpened: (open: boolean) => void;
    user: User | null;
}

export default function PetForm({ modalOpened, setModalOpened, user }: PetFormProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string | null>(null);
    const [type, setType] = useState<string | null>(null);
    const [breed, setBreed] = useState<string | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [energy, setEnergy] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [likes, setLikes] = useState<string | null>(null);
    const [photo_urls, setPhotoUrls] = useState<string[] | null>(null);

    // add getProfile using useCallBack here when implementing "edit" button, to allow code reusability

    async function addPetProfile({ name, type, breed, weight, birthday, energy, description, likes, photo_urls }: {
        name: string | null
        type: string | null
        breed: string | null
        weight: number | null
        birthday: Date | null
        energy: string | null
        description: string | null
        likes: string | null
        photo_urls: string[] | null
    }) {

        // update relations in supabase with info, else throw error
        try {
            setLoading(true)
            let birthdayString = new Date().toISOString();
            if (birthday) {
                birthdayString = birthday.toISOString();
            }

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
                    energy_level: energy,
                    description: description,
                    likes: likes,
                    created_at: new Date().toISOString()
                })
                .select('id') // select the pet_id for insertion into pet_photos
                .single(); // expecting a single row
            if (error) throw error;

            const pet_id = data.id;
            // insert into `pet_photos` relation - each url creates a new row
            if (photo_urls && photo_urls.length > 0) {
                const photoInserts = photo_urls.map(photo_url => ({ pet_id, photo_url }))

                const { error: photoError } = await supabase
                    .from('pet_photos')
                    .insert(photoInserts);
                if (photoError) throw photoError;
            }

            alert('Pet added!')
        } catch (error) {
            alert('Unable to add pet!')
        } finally {
            setLoading(false)
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

    // modal contains name, type, breed, weight, bday, energy level, description, likes, photo upload fields
    // name, type, breed, age are mandatory fields
    return (
        <Modal
            opened={modalOpened}
            onClose={() => {
                setModalOpened(false)
                setName(null);
                setType(null);
                setBreed(null);
                setWeight(null);
                setBirthday(null);
                setEnergy(null);
                setDescription(null);
                setLikes(null);
                setPhotoUrls(null);
            }}
            title="Create pet profile"
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
                    placeholder="Pick type"
                    value={type || ''}
                    data={['Dog', 'Cat', 'Rabbit', 'Hamster', 'Bird', 'Guinea Pig', 'Chinchilla', 'Other']}
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
                    placeholder="Pick energy level"
                    value={energy || ''}
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
                    uid={user?.id ?? null}
                    urls={photo_urls}
                    onUpload={(urls: string[]) => {
                        setPhotoUrls(urls)
                    }}
                />
                <Button variant="default" color="gray"
                    onClick={async () => {
                        if (validateForm()) {
                            await addPetProfile({ name, type, breed, weight, birthday, energy, description, likes, photo_urls });
                            setModalOpened(false); // close modal upon successful addition of pet
                            // reset all fields to prepare modal for next addition
                            setName(null);
                            setType(null);
                            setBreed(null);
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