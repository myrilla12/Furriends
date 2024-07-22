import { Post } from "@/utils/definitions";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Card, Image, Text, Badge, Group } from '@mantine/core';
import ChatButton from "@/components/chat/chatButton";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { useEffect, useState } from "react";
import printTimestamp from "@/utils/printTimestamp";

type PostCardProps = {
    user: User,
    post: Post,
    service: boolean,
}

/**
 * Renders a post card displaying details of a post.
 * 
 * @param {PostCardProps} props - The props for the component.
 * @param {User} props.user - The user object containing user information.
 * @param {Post} props.post - The post data.
 * @param {boolean} props.service - Whether post is a service or community post.
 * @returns {JSX.Element} The rendered PostCard component.
 */
export default function PostCard({ user, post, service }: PostCardProps) {
    const supabase = createClient();
    const [username, setUsername] = useState<string>('');
    const [avatar_url, setAvatarUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Fetches and profile data of the author of the post.
     * 
     * @async
     * @function getProfileData
     */
    useEffect(() => {
        async function getProfileData() {
            try {
                setLoading(true);
                const { data: ProfileData, error: ProfileError } = await supabase
                    .from('profiles')
                    .select(`username, avatar_url`)
                    .eq('id', post.post_author)
                    .single();
    
                if (ProfileData) {
                    setUsername(ProfileData.username);
                    setAvatarUrl(ProfileData.avatar_url);
                }
            } catch (ProfileError) {
                console.log("Error fetching profile data", ProfileError)
            } finally {
                setLoading(false);
            }
        }
        getProfileData()
    }, [post.post_author]);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder w={600}>
        <Card.Section className="bg-amber-900 bg-opacity-10">
            <Group m="xs">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700 ml-4 mr-1">
                    <Image
                        src={avatar_url} // use default avatar if no avatar set
                        alt="profile picture"
                        width={48}
                        height={48}
                        className="object-cover"
                    />
                </div>
                <Text size="md" fw={700} c="#6d543e">{username}</Text>
            </Group>
        </Card.Section>

        <Card.Section>
            <Image
                src={post.post_image}
                h={400}
                fit="contain"
                alt="Not loading..."
                className="bg-slate-950"
            />
        </Card.Section>

        <Group justify="space-between" mt="sm" style={{ display: 'flex', alignItems: 'center' }}>
            <Text fw={700} size="xl" c="#6d543e" style={{ flex: 1, overflowWrap: 'anywhere' }}>{post.post_title}</Text>
            {post.post_pricing && 
                (service &&
                (post.post_pricing[0] === post.post_pricing[1]) ?
                    <Badge size="md" color="#6d543e">
                        ${post.post_pricing[0]} 
                    </Badge> :
                    <Badge size="md" color="#6d543e">
                        ${post.post_pricing[0]} - {post.post_pricing[1]}
                    </Badge>
                )
            }
        </Group>

        <Group gap="xs">
            <MapPinIcon className="w-4 text-gray-500" />
            <Text size="sm" c="dimmed">{post.post_location}</Text>
        </Group>
        <Text size="xs" c="dimmed">Posted at: {printTimestamp(post.created_at)}</Text>

        <Text size="sm" mb="xs">
            {post.post_content}
        </Text>
        
        {(user.id !== post.post_author) && service && <ChatButton owner_id={post.post_author} button_color="white" feed={true}/>}
        </Card>
    );
}