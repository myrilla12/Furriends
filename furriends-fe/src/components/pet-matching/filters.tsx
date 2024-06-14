import { Text, Box, Select, Group, ComboboxItem, OptionsFilter, Image } from "@mantine/core";

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
                <Text size='xl' fw={700}>Filters</Text>

                <Group>
                    <Select
                        placeholder="Pet type"
                        data={['Dog', 'Cat', 'Rabbit', 'Hamster', 'Bird']}
                        filter={optionsFilter}
                        searchable
                    />

                    <Select
                        placeholder="Age"
                        data={['< 1 year old'].concat(age)}
                        filter={optionsFilter}
                        searchable
                    />

                    <Select
                        placeholder="Size"
                        data={['< 1 kg'].concat(size)}
                        filter={optionsFilter}
                        searchable
                    />

                    <Select
                        placeholder="Energy level"
                        data={['Very low', 'Low', 'Medium', 'High', 'Very High']}
                        filter={optionsFilter}
                        searchable
                    />

                    <Select
                        placeholder="Location"
                        data={['East', 'West', 'Central', 'North', 'South']}
                        filter={optionsFilter}
                        searchable
                    />
                </Group>
            </Box>
    );
}