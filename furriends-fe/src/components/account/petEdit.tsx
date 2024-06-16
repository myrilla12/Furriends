// pet edit form allowing users to edit their pet details; autofilled with exisitng profile data
'use client'

import { useCallback, useEffect, useState } from 'react';
import { Modal, ScrollArea, Button, TextInput, Select, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import FileUpload from './fileUpload';
import { type User } from '@supabase/supabase-js';
import { createClient } from '../../../../furriends-backend/utils/supabase/component';
import { Pet } from '@/utils/definitions';
import '@mantine/dates/styles.css';

type PetEditProps = {
    modalOpened: boolean;
    setModalOpened: (open: boolean) => void;
    user: User | null;
    pet: Pet
}

export default function PetEdit({ modalOpened, setModalOpened, user, pet }: PetEditProps) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string | null>(null);
    const [type, setType] = useState<string | null>(null);
    const [breed, setBreed] = useState<string | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [energy_level, setEnergy] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [likes, setLikes] = useState<string | null>(null);
    const [photo_urls, setPhotoUrls] = useState<string[] | null>(null);

    // create a memoized getProfile; only recreated if dependencies change
    const getProfile = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error, status } = await supabase
                .from('pets')
                .select(`username, avatar_url`)
                .eq('id', user?.id)
                .single()

            if (error && status !== 406) {
                console.log(error)
                throw error
            }

            if (data) {
                setUsername(data.username)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            alert('Error loading user data!')
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => { getProfile() }, [user, getProfile])

    async function updateProfile({
        username,
        avatar_url,
    }: {
        username: string | null
        avatar_url: string | null
    }) {
        try {
            setLoading(true)

            const { error } = await supabase.from('profiles').upsert({
                id: user?.id as string,
                username,
                avatar_url,
                updated_at: new Date().toISOString(),
            })
            if (error) throw error
            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
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
                    placeholder="Select type"
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
                    uid={user?.id ?? null}
                    urls={photo_urls}
                    onUpload={(urls: string[]) => {
                        setPhotoUrls(urls)
                    }}
                />
                <Button variant="default" color="gray"
                    onClick={async () => {
                        if (validateForm()) {
                            await updatePetProfile({ name, type, breed, weight, birthday, energy_level, description, likes, photo_urls });
                            setModalOpened(false); // close modal upon addition of pet
                        }
                    }}
                    disabled={loading} // button shows loading while data is uploaded
                ></Button>
            </div>
        </Modal>
    );
}