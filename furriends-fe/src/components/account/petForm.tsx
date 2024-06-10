import { useState } from 'react';
import { Button, Modal, TextInput, Textarea, MultiSelect, FileInput } from '@mantine/core';
import { createClient } from '../../../../furriends-backend/utils/supabase/component'

type PetFormProps = {
    modalOpened: boolean;
    setModalOpened: (open: boolean) => void;
    onPetAdded: (pet: any) => void;
}

export default function PetForm({ modalOpened, setModalOpened, onPetAdded }: PetFormProps) {
    const supabase = createClient();

    const [newPet, setNewPet] = useState({
        name: '',
        age: '',
        breed: '',
        description: '',
        characterTags: [],
        hobbies: [],
    });
    const [pictures, setPictures] = useState<File[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPet({ ...newPet, [name]: value });
    };

    const handleFileChange = (files: File[]) => {
        setPictures(files);
    };

    const handleMultiSelectChange = (name: string, values: string[]) => {
        setNewPet({ ...newPet, [name]: values });
    };

    const handleSubmit = async () => {
        const { data: petData, error: petError } = await supabase.from('pets').insert([
            { ...newPet, owner_id: supabase.auth.getUser()?.id,},
        ]);

        if (petError) {
            console.error(petError);
            return;
        }

        const petId = petData[0].id;

        for (const picture of pictures) {
            const { data, error } = await supabase.storage
                .from('pet_pictures')
                .upload(`public/${petId}/${picture.name}`, picture);

            if (error) {
                console.error(error);
                return;
            }

            const pictureUrl = supabase.storage
                .from('pet_pictures')
                .getPublicUrl(data.path)
                .publicURL;

            const { error: photoError } = await supabase.from('pet_photos').insert([
                {
                    pet_id: petId,
                    photo_url: pictureUrl,
                },
            ]);

            if (photoError) {
                console.error(photoError);
            }
        }

        onPetAdded(petData[0]);
        setModalOpened(false);
        setNewPet({
            name: '',
            age: '',
            breed: '',
            description: '',
            characterTags: [],
            hobbies: [],
        });
        setPictures([]);
    };

    return (
        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Add a Pet">
            <div className="space-y-4">
                <TextInput
                    label="Name"
                    name="name"
                    value={newPet.name}
                    onChange={handleInputChange}
                />
                <TextInput
                    label="Age"
                    name="age"
                    value={newPet.age}
                    onChange={handleInputChange}
                />
                <TextInput
                    label="Breed"
                    name="breed"
                    value={newPet.breed}
                    onChange={handleInputChange}
                />
                <FileInput
                    label="Pictures"
                    multiple
                    onChange={(files) => handleFileChange(Array.from(files))}
                    accept="image/*"
                />
                <Textarea
                    label="Description"
                    name="description"
                    value={newPet.description}
                    onChange={handleInputChange}
                />
                <MultiSelect
                    label="Character Tags"
                    data={['Friendly', 'Playful', 'Loyal']}
                    value={newPet.characterTags}
                    onChange={(values) => handleMultiSelectChange('characterTags', values)}
                />
                <MultiSelect
                    label="Hobbies"
                    data={['Running', 'Swimming', 'Sleeping']}
                    value={newPet.hobbies}
                    onChange={(values) => handleMultiSelectChange('hobbies', values)}
                />
                <Button onClick={handleSubmit}>Create</Button>
            </div>
        </Modal>
    );
}