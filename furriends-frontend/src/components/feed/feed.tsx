import { Post } from "@/utils/definitions";
import { ScrollArea, Stack } from "@mantine/core";
import PostCard from "./post";
import { User } from "@supabase/supabase-js";

type FeedProps = {
    user: User,
    posts: Post[],
    service: boolean
}

/**
 * Feed component for displaying freelancer posts.
 *
 * @param {FeedProps} props - The component props
 * @param {User} props.user - Authenticated user information
 * @param {Post[]} props.posts - All freelancer post information. 
 * @param {boolean} props.service - Whether Feed is in service or community page. 
 * @returns {JSX.Element} The Feed component.
 */
export default function Feed({ user, posts, service }: FeedProps) {
    return (
        <ScrollArea.Autosize mah={600} w={400} mx="auto" scrollbars="y">
            <Stack gap="md">
                {posts?.map((post, index) => (
                    <PostCard key={post.id || index} user={user} post={post} service={service}/>
                ))}
            </Stack>
        </ScrollArea.Autosize>
    );
}