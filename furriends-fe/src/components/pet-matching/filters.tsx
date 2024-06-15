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

// Creating array for filter's age options
const age = Array(20)
  .fill(1)
  .map((_, index) => `${index + 1} years old`)
  .concat(['> 20 years old']);

// Creating array for filter's size options
const size = Array(30)
  .fill(1)
  .map((_, index) => `${index + 1} kg`)
  .concat(['> 30 kg']);
  
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
                        />

                        <NumberInput
                                w={160}
                                placeholder="To ~ years old"
                        />      

                        <Space w='xs'/>

                        <Text size='sm'>Size:</Text>

                        <NumberInput
                                w={110}
                                placeholder="From ~ kg"
                        />

                        <NumberInput
                                w={110}
                                placeholder="To ~ kg"
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