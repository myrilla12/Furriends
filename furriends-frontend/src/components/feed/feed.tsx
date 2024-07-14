import { FreelancerPost } from "@/utils/definitions";
import { Box, ScrollArea, Stack } from "@mantine/core";
import ServicePost from "./servicePost";
import { User } from "@supabase/supabase-js";

type FeedProps = {
    user: User,
    posts: FreelancerPost[],
}

/**
 * Feed component for displaying freelancer posts.
 *
 * @param {FreelancerPost[]} props.posts - All freelancer post information. 
 * @returns {JSX.Element} The Feed component.
 */
export default function Feed({ user, posts }: FeedProps) {
    return (
        <ScrollArea.Autosize mah={600} w={400} mx="auto" scrollbars="y">
            <Stack gap="md">
                {posts?.map((post) => (
                    <ServicePost user={user} post={post} />
                ))}
            </Stack>
        </ScrollArea.Autosize>
    );
}