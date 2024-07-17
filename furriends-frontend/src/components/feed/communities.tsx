import { Community } from "@/utils/definitions";
import { Box, Button, Flex } from "@mantine/core";
import CommunityList from "./communityList";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import CommunityCreationModal from "./communitiesCreationModal";

type CommunitiesProps = {
    user: User;
    communities: Community[];
    mine: boolean;
    joinCommunity: (id: string) => void;
    leaveCommunity: (id: string) => void;
    addNewCommunity: (community: Community) => void;
}

/**
 * Communities component for displaying communties.
 *
 * @param {CommunitiesProps} props - The component props.
 * @param {User} props.user - The user object containing user information.
 * @param {Community[]} props.myCommunities - Communities that have been fetched from index.
 * @param {boolean} props.mine - True if user is a member of the communities. 
 * @param {function} props.joinCommunity - Function to join a community.
 * @param {function} props.leaveCommunity - Function to leave a community.
 * @param {function} props.addNewCommunity - Function to update state upon adding new community.
 * @returns {JSX.Element} The Communities component.
 */
export default function Communities({ user, communities, mine, joinCommunity, leaveCommunity, addNewCommunity }: CommunitiesProps) {
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
                <CommunityCreationModal user={user} opened={opened} setOpened={setOpened} addNewCommunity={addNewCommunity}/>
            </Flex>
            <CommunityList user={user} communities={communities} mine={mine} joinCommunity={joinCommunity} leaveCommunity={leaveCommunity}/>
        </Box>
    );
}