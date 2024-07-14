import { Post } from "@/utils/definitions";
import { ScrollArea, Stack } from "@mantine/core";
import ServicePost from "./servicePost";
import { User } from "@supabase/supabase-js";

type FeedProps = {
    user: User,
    posts: Post[],
    service: boolean
}

/**
 * Feed component for displaying freelancer posts.
 *
 * @param {Post[]} props.posts - All freelancer post information. 
 * @returns {JSX.Element} The Feed component.
 */
export default function Feed({ user, posts, service }: FeedProps) {
    return (
        <ScrollArea.Autosize mah={600} w={400} mx="auto" scrollbars="y">
            <Stack gap="md">
                {posts?.map((post) => (
                    <ServicePost user={user} post={post} service={service}/>
                ))}
            </Stack>
        </ScrollArea.Autosize>
    );
}