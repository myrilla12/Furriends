import { Community } from "@/utils/definitions";
import { Box, Button, Flex } from "@mantine/core";
import CommunityList from "./communityList";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import CommunityCreationModal from "./communitiesCreationModal";

/**
 * Communities component for displaying communties that user is not a member of.
 *
 * @returns {JSX.Element} The Communities component.
 */
export default function Communities({ user, communities, mine }: {user: User; communities: Community[]; mine: boolean;}) {
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
                <h1 className="mt-1 text-xl font-bold text-amber-950">{mine ? "My Communities" : "Discover Communities"}</h1>
                {mine && <Button 
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
                }
                <CommunityCreationModal user={user} opened={opened} setOpened={setOpened}/>
            </Flex>
            <CommunityList user={user} communities={communities} mine={mine}/>
        </Box>
    );
}