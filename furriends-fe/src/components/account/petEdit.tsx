import { useState } from 'react';
import { Modal, ScrollArea, Button, TextInput, Select, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import FileUpload from './fileUpload';
import { type User } from '@supabase/supabase-js';
import '@mantine/dates/styles.css';

type PetEditProps = {
    modalOpened: boolean;
    setModalOpened: (open: boolean) => void;
    user: User | null;
    pet: {
        name: string;
        type: string;
        breed: string;
        weight: number;
        birthday: string;
        energy_level: string;
        description: string;
        likes: string,
        photos: string[];
    };
}

export default function PetEdit({ modalOpened, setModalOpened, user, pet }: PetEditProps) {
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
                            await addPetProfile({ name, type, breed, weight, birthday, energy_level, description, likes, photo_urls });
                            setModalOpened(false); // close modal upon addition of pet
                        }
                    }}
                    disabled={loading} // button shows loading while data is uploaded
                ></Button>
            </div>
        </Modal>
    );
}