import { Text, Box, Select, Group, ComboboxItem, OptionsFilter, NumberInput, Space } from "@mantine/core";

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
    return(
        <Box m='lg'>
                <Text size='xl' fw={500}>Filters</Text>
                <div style={{ display: 'flex' }}>
                    <Group>
                        <Select
                            w={150}
                            placeholder="Pet type"
                            data={['Dog', 'Cat', 'Rabbit', 'Hamster', 'Bird', 'Turtle/Tortoise', 'Guinea pig', 'Chincilla', 'Pig']}
                            filter={optionsFilter}
                            searchable
                        />

                        <Space w='xs'/>

                        <Text size='sm'>Age:</Text>

                        <NumberInput
                                w={160}
                                placeholder="From ~ years old"
                                allowDecimal={false}
                                allowLeadingZeros={false}
                                allowNegative={false}
                        />

                        <NumberInput
                                w={160}
                                placeholder="To ~ years old"
                                allowDecimal={false}
                                allowLeadingZeros={false}
                                allowNegative={false}
                        />      

                        <Space w='xs'/>

                        <Text size='sm'>Size:</Text>

                        <NumberInput
                                w={110}
                                placeholder="From ~ kg"
                                allowDecimal={false}
                                allowLeadingZeros={false}
                                allowNegative={false}
                        />

                        <NumberInput
                                w={110}
                                placeholder="To ~ kg"
                                allowDecimal={false}
                                allowLeadingZeros={false}
                                allowNegative={false}
                        />

                        <Space w='xs'/>

                        <Select
                            w={130}
                            placeholder="Energy level"
                            data={['Very low', 'Low', 'Medium', 'High', 'Very High']}
                            filter={optionsFilter}
                            searchable
                        />

                        <Space w='xs'/>

                        <Select
                            w={110}
                            placeholder="Location"
                            data={['East', 'West', 'Central', 'North', 'South']}
                            filter={optionsFilter}
                            searchable
                        />
                    </Group>
                </div>
            </Box>
    );
}