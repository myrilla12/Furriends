import { FreelancerPost } from "@/utils/definitions";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import ChatButton from "../chat/chatButton";

type ServicePostProps = {
    post: FreelancerPost,
}

export default function ServicePost({ post }: ServicePostProps) {

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder w={400}>
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

        <Group gap="xs" mb="xs">
            <MapPinIcon className="w-4 text-gray-500" />
            <Text size="sm" c="dimmed">{post.location}</Text>
        </Group>

        <Text size="sm" c="dimmed" mb="xs">
            {post.content}
        </Text>
        
        <ChatButton owner_id={post.author_id} button_color="white" feed={true}/>
        </Card>
    );
}