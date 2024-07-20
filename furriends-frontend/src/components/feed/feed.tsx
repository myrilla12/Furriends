import { Community, Post } from "@/utils/definitions";
import { Avatar, Box, Button, Flex, Image, ScrollArea, Stack, Title } from "@mantine/core";
import PostCard from "./post";
import { User } from "@supabase/supabase-js";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type FeedProps = {
    user: User;
    posts: Post[];
    service: boolean;
    community: Community | null;
    returnToGeneralFeed: () => void;
}

/**
 * Feed component for displaying freelancer posts.
 *
 * @param {FeedProps} props - The component props
 * @param {User} props.user - Authenticated user information
 * @param {Post[]} props.posts - All freelancer post information. 
 * @param {boolean} props.service - Whether Feed is in service or community page. 
 * @param {Community | null} props.community - The community feed is displaying at the moment, null if it is on general feed.
 * @param {function} returnToGeneralFeed - Resets feed to general posts upon clicking return to general feed. 
 * @returns {JSX.Element} The Feed component.
 */
export default function Feed({ user, posts, service, community, returnToGeneralFeed }: FeedProps) {
    
    return (
        <ScrollArea.Autosize mah={630} mx="auto" scrollbars="y">
            {community &&
                <Box mb="md" pb="sm" className="relative border-b-2">
                    <Button 
                        className="absolute top-0 right-0"
                        leftSection={<ArrowLeftIcon className="h-5 w-5"/>} 
                        variant="transparent" 
                        c="black" 
                        size="compact"
                        onClick={returnToGeneralFeed}
                    >
                        Return to general feed
                    </Button>
                    <Flex direction="row" align="center" gap="lg" p="xs">
                        <Avatar src={community.avatar_url} radius="xl" size="xl" />
                        <Title>{community.name}</Title>
                    </Flex>
                </Box>
            }
            
            {posts.length === 0 &&
                <Stack
                    align="center"
                >
                <Image
                    src="/sadface.png"
                    w={400}
                    alt="Picture of a sad dog"
                />
    
                <Title order={2}>No posts yet</Title>
            </Stack>
            }
            <Stack gap="md">
                {posts?.map((post, index) => (
                    <PostCard key={post.id || index} user={user} post={post} service={service}/>
                ))}
            </Stack>
        </ScrollArea.Autosize>
    );
}