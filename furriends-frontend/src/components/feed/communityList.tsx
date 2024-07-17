import { Community } from "@/utils/definitions";
import { createClient } from "@/utils/supabase/component";
import { Accordion, Avatar, Button, Group, Text } from "@mantine/core";
import { User } from "@supabase/supabase-js";

type CommunityListProps = {
    user: User;
    communities: Community[];
    mine: boolean;
    joinCommunity: (id: string) => void;
    leaveCommunity: (id: string) => void;
}

/**
 * CommunityList component for displaying accordion of communities.
 *
 * @param {CommunityListProps} props - The component props.
 * @param {User} props.user - The user object containing user information.
 * @param {Community[]} props.myCommunities - Communities that have been fetched from index.
 * @param {boolean} props.mine - True if user is a member of the communities. 
 * @param {function} props.joinCommunity - Function to join a community.
 * @param {function} props.leaveCommunity - Function to leave a community.
 * @returns {JSX.Element} The Communities component.
 */
export default function CommunityList({ user, communities, mine, joinCommunity, leaveCommunity }: CommunityListProps) {

    function AccordionLabel({ id ,name, avatar_url }: Community) {
        return (
            <Group wrap="nowrap">
                <Avatar src={avatar_url} radius="xl" size="md" />
                <Text className="flex-grow" c="#6d543e" fw={600} size="md">{name}</Text>
                {mine ?
                    <Button 
                        size='xs'
                        variant='light' 
                        color='rgba(255, 5, 5, 1)'
                        onClick={async (e) => {
                            e.stopPropagation();
                            await leaveCommunity(id);
                        }}
                    >
                        Leave
                    </Button> :
                    <Button 
                        size='xs'
                        variant='light' 
                        color='rgba(17, 120, 25, 1)'
                        onClick={async (e) => {
                            e.stopPropagation();
                            await joinCommunity(id);
                        }}
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