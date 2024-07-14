import { FreelancerPost, Profile } from "@/utils/definitions";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Card, Image, Text, Badge, Button, Group, Box } from '@mantine/core';
import ChatButton from "@/components/chat/chatButton";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { useEffect, useState } from "react";
import printTimestamp from "@/utils/printTimestamp";

type ServicePostProps = {
    user: User,
    post: FreelancerPost,
}

/**
 * Renders a service post card displaying details of a freelancer's service post.
 * 
 * @param {ServicePostProps} props - The props for the component.
 * @param {FreelancerPost} props.post - The service post data.
 * @returns {JSX.Element} The rendered ServicePost component.
 */
export default function ServicePost({ user, post }: ServicePostProps) {
    const supabase = createClient();
    const [username, setUsername] = useState<string>('');
    const [avatar_url, setAvatarUrl] = useState<string>('');

    /**
     * Fetches and profile data of the author of the post.
     * 
     * @async
     * @function getProfileData
     */
    async function getProfileData() {
        try {
            const { data: ProfileData, error: ProfileError } = await supabase
                .from('profiles')
                .select(`username, avatar_url`)
                .eq('id', post.author_id)
                .single();

            if (ProfileData) {
                setUsername(ProfileData.username);
                setAvatarUrl(ProfileData.avatar_url);
            }
        } catch (ProfileError) {
            console.log("Error fetching profile data", ProfileError)
        } finally {
            
        }
    }
    useEffect(() => { getProfileData() }, [user, getProfileData])

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder w={400}>
        <Card.Section className="bg-amber-900 bg-opacity-10">
            <Group m="xs">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gray-700 ml-4 mr-1">
                    <Image
                        src={avatar_url} // use default avatar if no avatar set
                        alt="profile picture"
                        width={48}
                        height={48}
                        className="object-cover"
                    />
                </div>
                <Text size="lg" fw={700} c="#6d543e">{username}</Text>
            </Group>
        </Card.Section>
        <Card.Section>
            <Image
                src={post.photo}
                h={400}
                fit="contain"
                alt="Not loading..."
                className="bg-slate-950"
            />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
            <Text fw={700} size="xl" c="#6d543e">{post.title}</Text>
            {post.pricing[0] === post.pricing[1] ?
                <Badge size="md" color="#6d543e">
                    ${post.pricing[0]} 
                </Badge> :
                <Badge size="md" color="#6d543e">
                    ${post.pricing[0]} - {post.pricing[1]}
                </Badge>
            }
        </Group>

        <Group gap="xs">
            <MapPinIcon className="w-4 text-gray-500" />
            <Text size="sm" c="dimmed">{post.location}</Text>
        </Group>
        <Text size="xs" c="dimmed" mb="xs">Posted at: {printTimestamp(post.created_at)}</Text>

        <Text size="sm" c="dimmed" mb="xs">
            {post.content}
        </Text>
        
        {user.id !== post.author_id && <ChatButton owner_id={post.author_id} button_color="white" feed={true}/>}
        </Card>
    );
}