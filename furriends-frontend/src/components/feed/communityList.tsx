import { Community } from "@/utils/definitions";
import { Accordion, Avatar, Button, Group, Text } from "@mantine/core";

export default function CommunityList({ communities, mine }: { communities: Community[]; mine: boolean;}) {
    function AccordionLabel({ name, avatar_url }: Community) {
        return (
            <Group wrap="nowrap">
                <Avatar src={avatar_url} radius="xl" size="md" />
                <Text className="flex-grow" c="#6d543e" fw={600} size="md">{name}</Text>
                {mine ?
                    <Button 
                        size='xs'
                        variant='light' 
                        color='rgba(255, 5, 5, 1)'
                    >
                        Leave
                    </Button> :
                    <Button 
                        size='xs'
                        variant='light' 
                        color='#6d543e'
                    >
                        Join
                    </Button>
                }
            </Group>
        );
    }

    const list = communities?.map((community) => (
        <Accordion.Item value={community.id} key={community.name}>
            <Accordion.Control>
                <AccordionLabel {...community} />
            </Accordion.Control>
            <Accordion.Panel>
                <Text size="sm">{community.description}</Text>
            </Accordion.Panel>
        </Accordion.Item>
    ));
    
    return (
        <Accordion chevronPosition="left" variant="contained">
            {list}
        </Accordion>
    );
}