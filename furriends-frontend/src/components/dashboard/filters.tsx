import { calculateAge } from "@/utils/calculateAge";
import { Pet } from "@/utils/definitions";
import { Text, Box, Select, Group, ComboboxItem, OptionsFilter, NumberInput, Space } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const optionsFilter: OptionsFilter = ({ options, search }) => {
    const splittedSearch = search.toLowerCase().trim().split(' ');

    return (
        options as ComboboxItem[]).filter((option) => {
            const words = option.label.toLowerCase().trim().split(' ');
            return splittedSearch.every((searchWord) => words.some((word) => word.includes(searchWord)));
        });
};

type FiltersProps = {
    pets: Pet[];
    setFilteredPets: Dispatch<SetStateAction<Pet[]>>;
};

export default function Filters({ pets, setFilteredPets }: FiltersProps) {
    const [type, setType] = useState<string | null>(null);
    const [fromAge, setFromAge] = useState<string | number>('');
    const [toAge, setToAge] = useState<string | number>('');
    const [fromWeight, setFromWeight] = useState<string | number>('');
    const [toWeight, setToWeight] = useState<string | number>('');
    const [energy_level, setEnergy] = useState<string | null>(null);

    useEffect(() => {
        const filterPets = () => { // loop through pets & filter out those the user wants, then set the new pet list
            const filtered = () =>

                pets.filter(pet => {
                    // Type filter
                    if (type && pet.type !== type) {
                        return false;
                    }

                    // Age filters
                    const petAge = calculateAge(pet);
                    if (fromAge && petAge < Number(fromAge)) {
                        return false;
                    }
                    if (toAge && petAge > Number(toAge)) {
                        return false;
                    }

                    // Weight filters
                    const petWeight = pet.weight;
                    if (fromWeight && petWeight && petWeight < Number(fromWeight)) {
                        return false;
                    }
                    if (toWeight && petWeight && petWeight > Number(toWeight)) {
                        return false;
                    }

                    // Energy level filter
                    if (energy_level && pet.energy_level !== energy_level) {
                        return false;
                    }

                    return true;
                });

            setFilteredPets(filtered); // set filtered pets as the new pet list
        }

        filterPets();
    }, [type, fromAge, toAge, fromWeight, toWeight, energy_level, setFilteredPets]) // call filterPets if there are any changes to these states

    // // check current states
    // console.log('type:', type);
    // console.log('fromAge:', fromAge);
    // console.log('toAge:', toAge);
    // console.log('fromWeight:', fromWeight);
    // console.log('toWeight:', toWeight);
    // console.log('energy level:', energy_level);

    // filter input fields
    return (
        <Box m='lg'>
            <Text size='xl' fw={700}>Filters</Text>
            <div style={{ display: 'flex' }}>
                <Group>
                    <Select
                        w={150}
                        label='Pet type'
                        placeholder='Pet type'
                        data={['Dog', 'Cat', 'Rabbit', 'Hamster', 'Bird', 'Turtle/Tortoise', 'Guinea pig', 'Chincilla', 'Others']}
                        filter={optionsFilter}
                        searchable
                        onChange={setType}
                    />

                    <Space w='xs' />

                    <NumberInput
                        w={100}
                        label='Age'
                        placeholder='From ~'
                        allowDecimal={false}
                        allowLeadingZeros={false}
                        allowNegative={false}
                        onChange={setFromAge}
                    />

                    <Text size='sm' mt='lg' fw={700}>-</Text>

                    <NumberInput
                        w={100}
                        label=' '
                        placeholder='To ~'
                        allowDecimal={false}
                        allowLeadingZeros={false}
                        allowNegative={false}
                        min={Number(fromAge)}
                        onChange={setToAge}
                    />

                    <Text size='sm' mt='lg'>years old</Text>

                    <Space w='xs' />

                    <NumberInput
                        w={100}
                        label='Size'
                        placeholder='From ~'
                        allowDecimal={false}
                        allowLeadingZeros={false}
                        allowNegative={false}
                        onChange={setFromWeight}
                    />

                    <Text size='sm' mt='lg' fw={700}>-</Text>

                    <NumberInput
                        w={100}
                        label=' '
                        placeholder='To ~'
                        allowDecimal={false}
                        allowLeadingZeros={false}
                        allowNegative={false}
                        min={Number(fromWeight)}
                        onChange={setToWeight}
                    />

                    <Text size='sm' mt='lg'>kg</Text>

                    <Space w='xs' />

                    <Select
                        w={130}
                        label='Energy level'
                        placeholder='Energy level'
                        data={['Very low', 'Low', 'Medium', 'High', 'Very High']}
                        filter={optionsFilter}
                        searchable
                        onChange={setEnergy}
                    />

                    <Space w='xs' />

                    <Select
                        w={110}
                        label='Location'
                        placeholder='Location'
                        data={['East', 'West', 'Central', 'North', 'South']}
                        filter={optionsFilter}
                        searchable
                    />
                </Group>
            </div>
        </Box>
    );
}