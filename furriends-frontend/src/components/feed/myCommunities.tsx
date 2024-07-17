import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Avatar, Box, Button, Flex } from "@mantine/core";
import { useState } from "react";
import CommunityCreationModal from "./communitiesCreationModal";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";

/**
 * My Communities component for displaying communities that user is a member of.
 *
 * @param {User} user - Authenticated user information
 * @returns {JSX.Element} The My Communities component.
 */
export default function MyCommunities({ user }: {user: User;}) {
    const supabase = createClient();
    const [opened, setOpened] = useState(false);

    async function getCommunityData() {
        const { data: CommunityIdsData, error: CommunityIdsError } = await supabase
            .from('community_users')
            .select(`community_id`)
            .eq('user_id', user.id);

        if (CommunityIdsError) {
            console.error("Error fetching my community ids: ", CommunityIdsData);
        }

        const ids = CommunityIdsData.map((community : { community_id: string; }) => community.community_id);

        const { data: CommunityData, error: CommunityError } = await supabase
            .from('communities')
            .select('*')
            .in('id', ids)
            .order('updated_at', { ascending: false });

        if (CommunityError) {
            console.error("Error fetching my community data: ", CommunityError);
        }

        return CommunityData;
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
        </Box>
    );
}