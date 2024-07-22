import { calculateAge } from "@/utils/calculateAge";
import { Pet } from "@/utils/definitions";
import { Text, Select, ComboboxItem, OptionsFilter, NumberInput, Button } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

/**
 * Custom options filter for the Select component from Mantine.
 *
 * @param {OptionsFilter} props - The options filter props.
 * @returns {ComboboxItem[]} The filtered options.
 */
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

/**
 * Component for filtering pets based on various criteria.
 *
 * @param {FiltersProps} props - The component props.
 * @param {Pet[]} props.pets - The array of pets to filter.
 * @param {Dispatch<SetStateAction<Pet[]>>} props.setFilteredPets - The function to set the filtered pets.
 * @returns {JSX.Element} The filters component.
 */
export default function Filters({ pets, setFilteredPets }: FiltersProps) {
    const [type, setType] = useState<string | null>(null);
    const [fromAge, setFromAge] = useState<string | number>('');
    const [toAge, setToAge] = useState<string | number>('');
    const [fromWeight, setFromWeight] = useState<string | number>('');
    const [toWeight, setToWeight] = useState<string | number>('');
    const [energy_level, setEnergy] = useState<string | null>(null);
    const [filtersVisible, setFiltersVisible] = useState(false);

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
    }, [pets, type, fromAge, toAge, fromWeight, toWeight, energy_level, setFilteredPets]) // call filterPets if there are any changes to these states


    const renderFilters = () => (

        <div className='flex flex-wrap gap-1'>
            <div className='flex flex-col mr-5'>
                <Select
                    w={150}
                    label='Pet type'
                    placeholder='Pet type'
                    data={['Dog', 'Cat', 'Rabbit', 'Hamster', 'Bird', 'Turtle/Tortoise', 'Guinea pig', 'Chincilla', 'Others']}
                    filter={optionsFilter}
                    searchable
                    onChange={setType}
                />
            </div>

            <div className='flex flex-col'>
                <div className='flex gap-2 items-center'>
                    <NumberInput
                        w={100}
                        label='Age'
                        placeholder='From'
                        allowDecimal={false}
                        allowLeadingZeros={false}
                        allowNegative={false}
                        onChange={setFromAge}
                    />
                    <Text className='text-sm font-bold mt-5'>-</Text>
                    <NumberInput
                        w={100}
                        label=' '
                        placeholder='To'
                        allowDecimal={false}
                        allowLeadingZeros={false}
                        allowNegative={false}
                        min={Number(fromAge)}
                        onChange={setToAge}
                    />
                    <Text className='text-sm mt-5 ml-1 mr-5'>years old</Text>
                </div>
            </div>

            <div className='flex flex-col'>
                <div className='flex gap-2 items-center'>
                    <NumberInput
                        w={100}
                        label='Size'
                        placeholder='From'
                        allowDecimal={false}
                        allowLeadingZeros={false}
                        allowNegative={false}
                        onChange={setFromWeight}
                    />
                    <Text className='text-sm font-bold mt-5'>-</Text>
                    <NumberInput
                        w={100}
                        label=' '
                        placeholder='To'
                        allowDecimal={false}
                        allowLeadingZeros={false}
                        allowNegative={false}
                        min={Number(fromWeight)}
                        onChange={setToWeight}
                    />
                    <Text className='text-sm mt-5 ml-1 mr-5'>kg</Text>
                </div>
            </div>

            <div className='flex flex-col mr-5'>
                <Select
                    w={130}
                    label='Energy level'
                    placeholder='Energy level'
                    data={['Very low', 'Low', 'Medium', 'High', 'Very High']}
                    filter={optionsFilter}
                    searchable
                    onChange={setEnergy}
                />
            </div>
        </div>
    );

    return (
        <div className='m-3'>
        <div className='flex items-center lg:hidden md:hidden cursor-pointer' onClick={() => setFiltersVisible(!filtersVisible)}>
            <p className='text-xl font-bold mb-1'>Filters</p>
            {filtersVisible ? <IconChevronUp className='ml-2' /> : <IconChevronDown className='ml-2' />}
        </div>
        <div className='lg:block md:block hidden'>
            <p className='text-xl font-bold mb-1'>Filters</p>
        </div>
        {filtersVisible && (
            <div className='flex flex-wrap gap-1 lg:hidden md:hidden'>
                {renderFilters()}
            </div>
        )}
        <div className='hidden lg:flex md:flex flex-wrap gap-1'>
            {renderFilters()}
        </div>
    </div>
    );

}