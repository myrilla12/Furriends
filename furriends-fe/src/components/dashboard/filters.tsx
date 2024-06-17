import { Text, Box, Select, Group, ComboboxItem, OptionsFilter, NumberInput, Space } from "@mantine/core";
import { useState } from "react";

const optionsFilter: OptionsFilter = ({ options, search }) => {
    const splittedSearch = search.toLowerCase().trim().split(' ');

    return (
        options as ComboboxItem[]).filter((option) => {
            const words = option.label.toLowerCase().trim().split(' ');
            return splittedSearch.every((searchWord) => words.some((word) => word.includes(searchWord)));
        }
    );
};
  
export default function Filters() {
    const [type, setType] = useState<string | null>(null);
    const [fromAge, setFromAge] = useState<string | number>('');
    const [toAge, setToAge] = useState<string | number>('');
    const [fromWeight, setFromWeight] = useState<string | number>('');
    const [toWeight, setToWeight] = useState<string | number>('');
    const [energy_level, setEnergy] = useState<string | null>(null);

    console.log('type:', type);
    console.log('fromAge:', fromAge);
    console.log('toAge:', toAge);
    console.log('fromWeight:', fromWeight);
    console.log('toWeight:', toWeight);
    console.log('energy level:', energy_level);

    return(
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

                        <Space w='xs'/>

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

                        <Space w='xs'/>

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

                        <Space w='xs'/>

                        <Select
                            w={130}
                            label='Energy level'
                            placeholder='Energy level'
                            data={['Very low', 'Low', 'Medium', 'High', 'Very High']}
                            filter={optionsFilter}
                            searchable
                            onChange={setEnergy}
                        />

                        <Space w='xs'/>

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