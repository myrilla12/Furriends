import { Community, Post } from "@/utils/definitions";
import { Avatar, Box, Button, Flex, Image, ScrollArea, Stack, Title } from "@mantine/core";
import PostCard from "./post";
import { User } from "@supabase/supabase-js";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
                        leftSection={<ArrowLeftIcon className="h-5 w-5" />}
                        variant="transparent"
                        c="black"
                        size="compact"
                        onClick={returnToGeneralFeed}
                        pb="lg"
                    >
                        Return to general feed
                    </Button>
                    <Flex direction="row" align="center" gap="lg" p="xs">
                        <Avatar src={community.avatar_url} radius="xl" size="xl" />
                        <Title order={2}>{community.name}</Title>
                    </Flex>
                </Box>
            }

            {posts.length === 0 &&
                <div className="flex flex-col h-[46vh] items-center justify-center">
                    <Image
                        src="/no-posts-yet.png"
                        w={160}
                        alt="Outline of a rabbit"
                        className="mb-5"
                    />
                    <Title order={4} className="text-center">Be the first to make a post here!</Title>
                </div>
            }
            <Stack gap="md">
                {posts?.map((post, index) => (
                    <PostCard key={post.id || index} user={user} post={post} service={service} />
                ))}
            </Stack>
        </ScrollArea.Autosize>
    );
}