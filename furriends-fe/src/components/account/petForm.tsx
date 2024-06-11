// modal that pops up when "add a pet" button is clicked in profile page
// allows user to create and add a new pet profile
'use client'

import { useState } from 'react';
import { Button, Modal, TextInput } from '@mantine/core';
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
    const [breed, setBreed] = useState<string | null>(null);
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [likes, setLikes] = useState<string | null>(null);
    const [photo_urls, setPhotoUrls] = useState<string[] | null>(null);

    // add getProfile using useCallBack here when implementing "edit" button, to allow code reusability

    async function addPetProfile({ name, breed, birthday, description, likes, photo_urls }: {
        name: string | null
        breed: string | null
        birthday: Date | null
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
            const { data, error: dataError } = await supabase
                .from('pets')
                .insert({ owner_id: user?.id as string, name: name, breed: breed, birthday: birthdayString, description: description, likes: likes, created_at: new Date().toISOString() })
                .select('id') // select the pet_id for insertion into pet_photos
                .single(); // expecting a single row
            if (dataError) throw dataError;

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

    // modal contains name, breed, age, description, likes, photo upload fields
    // name, breed, age are mandatory fields
    return (
        <Modal
            opened={modalOpened} onClose={() => {
                setModalOpened(false)
                setName(null);
                setBreed(null);
                setBirthday(null);
                setDescription(null);
                setLikes(null);
                setPhotoUrls(null);
            }}
            title="Add a pet"
        >
            <div className="space-y-4">
                <TextInput
                    label="Name"
                    name="name"
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextInput
                    label="Breed"
                    name="breed"
                    value={breed || ''}
                    onChange={(e) => setBreed(e.target.value)}
                    required
                />
                <DatePickerInput
                    label="Birthday"
                    name="birthday"
                    value={birthday}
                    onChange={(e) => setBirthday(e)}
                    required
                />
                <TextInput
                    label="Description"
                    name="description"
                    value={description || ''}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextInput
                    label="Likes"
                    name="likes"
                    value={likes || ''}
                    onChange={(e) => setLikes(e.target.value)}
                />
                <FileUpload
                    uid={user?.id ?? null}
                    urls={photo_urls}
                    onUpload={(urls: string[]) => {
                        setPhotoUrls(urls)
                        addPetProfile({ name, breed, birthday, description, likes, photo_urls: urls })
                    }}
                />
                <Button variant="default" color="gray"
                    onClick={() => addPetProfile({ name, breed, birthday, description, likes, photo_urls })}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Add'}
                </Button>
            </div>
        </Modal>
    );
}