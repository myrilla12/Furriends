import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Accordion, Avatar, Box, Button, Flex, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import CommunityCreationModal from "./communitiesCreationModal";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { Community } from "@/utils/definitions";
import CommunityList from "./communityList";

/**
 * My Communities component for displaying communities that user is a member of.
 *
 * @param {User} user - Authenticated user information
 * @param {Community[]} communities - Communities that the user is a member of. 
 * @returns {JSX.Element} The My Communities component.
 */
export default function MyCommunities({ user, communities }: {user: User; communities: Community[]}) {
    const [opened, setOpened] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Render nothing on the server to avoid mismatches
    }

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
            <CommunityList communities={communities} mine={true}/>
        </Box>
    );
}