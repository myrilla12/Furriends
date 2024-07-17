import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Accordion, Avatar, Box, Button, Flex, Group, Text } from "@mantine/core";
import { useState } from "react";
import CommunityCreationModal from "./communitiesCreationModal";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { Community } from "@/utils/definitions";

/**
 * My Communities component for displaying communities that user is a member of.
 *
 * @param {User} user - Authenticated user information
 * @returns {JSX.Element} The My Communities component.
 */
export default function MyCommunities({ user, communities }: {user: User; communities: Community[]}) {
    const [opened, setOpened] = useState(false);

    function AccordionLabel({ name, avatar_url }: Community) {
        return (
            <Group wrap="nowrap">
            <Avatar src={avatar_url} radius="xl" size="md" />
            <Text className="flex-grow" c="#6d543e" fw={600} size="md">{name}</Text>
            <Button 
                size='xs'
                variant='light' 
                color='rgba(255, 5, 5, 1)'
            >
                Leave
            </Button>
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
        <Box w={400}>
            <Flex direction="row" gap="xl" mt="xl" className="border-b-2">
                <h1 className="mt-1 text-xl font-bold text-amber-950">My Communities</h1>
                <Button 
                    leftSection={<PlusCircleIcon className='w-6'/>} 
                    ml='xl'
                    mb='xs' 
                    size='sm' 
                    variant='light' 
                    color='#6d543e' 
                    radius='md'
                    onClick={() => setOpened(true)}
                >
                    New community
                </Button>
                <CommunityCreationModal user={user} opened={opened} setOpened={setOpened}/>
            </Flex>
            <Accordion chevronPosition="left" variant="contained">
                {list}
            </Accordion>
        </Box>
    );
}