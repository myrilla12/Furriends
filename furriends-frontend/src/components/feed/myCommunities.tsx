import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Avatar, Box, Button, Flex } from "@mantine/core";
import { useState } from "react";
import CommunityCreationModal from "./communitiesCreationModal";
import { User } from "@supabase/supabase-js";

export default function MyCommunities({ user }: {user: User;}) {
    const [opened, setOpened] = useState(false);
    
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