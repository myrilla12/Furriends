import { Community, Post } from "@/utils/definitions";
import { createClient } from "@/utils/supabase/component";
import { Accordion, Avatar, Button, Group, Loader, Text } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { SetStateAction, useState } from "react";

type CommunityListProps = {
    user: User;
    communities: Community[];
    mine: boolean;
    joinCommunity: (id: string) => void;
    leaveCommunity: (id: string) => void;
    handleCommunityPosts: (fetchedPosts: SetStateAction<Post[]>, currentCommunity: Community) => void;
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
 * @param {function} props.handleCommunityPosts - Updates feed upon selecting a community.
 * @returns {JSX.Element} The Communities component.
 */
export default function CommunityList({ user, communities, mine, joinCommunity, leaveCommunity, handleCommunityPosts }: CommunityListProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState<string | null>(null);
    const [loadingCommunity, setLoadingCommunity] = useState<string | null>(null);

    /**
     * Fetches the posts under the selected community.
     *
     * @async
     * @param {string} id - Community id.
     */
    async function fetchCommunityPosts(id: string) {
        try {
            const { data, error } = await supabase
                .from("community_posts")
                .select("*")
                .eq("community_id", id);

            if (error) {
                console.error("Error fetching posts belonging to this community: ", error);
            }

            const currCommunity = communities.find(community => community.id === id)

            if (currCommunity) {
                handleCommunityPosts(data, currCommunity);
            }
        } catch (error) {
            console.error("Error fetching posts belonging to this community: ", error);
        }
    };

    /**
     * Renders an accordion label component for a community.
     *
     * @param {Object} props - The properties object.
     * @param {string} props.id - The unique identifier of the community.
     * @param {string} props.name - The name of the community.
     * @param {string} props.avatar_url - The URL of the community's avatar.
     *
     * @returns {JSX.Element} The rendered AccordionLabel component.
     */
    function AccordionLabel({ id , name, avatar_url }: Community) {
        return (
            <Group wrap="nowrap">
                <Avatar src={avatar_url} radius="xl" size="md" />
                <Text 
                    className="flex-grow" 
                    c="#6d543e"
                    fw={600} 
                    size="md"
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (mine) {
                            setLoadingCommunity(id);
                            await fetchCommunityPosts(id);
                            setLoadingCommunity(null);
                        }
                    }}
                >
                    {name}
                </Text>
                {loadingCommunity === id && <Loader size="xs" color="#6d543e"/>}

                {mine ?
                    <Button 
                        size="xs"
                        variant="light"
                        color="rgba(255, 5, 5, 1)"
                        rightSection={loading === id && <Loader size="xs" color="rgba(255, 5, 5, 1)"/>}
                        onClick={async (e) => {
                            e.stopPropagation();
                            setLoading(id);
                            await leaveCommunity(id);
                            setLoading(null);
                        }}
                    >
                        Leave
                    </Button> :
                    <Button 
                        size="xs"
                        variant="light" 
                        color="rgba(17, 120, 25, 1)"
                        rightSection={loading === id && <Loader size="xs" color="rgba(17, 120, 25, 1)"/>}
                        onClick={async (e) => {
                            e.stopPropagation();
                            setLoading(id);
                            await joinCommunity(id);
                            setLoading(null);
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