import { Image, Text, Center, Stack } from "@mantine/core";
import { useRouter } from "next/router";

export default function DashboardMatch() {
    const router = useRouter();
    return (
        <Stack
            h={300}
            bg="var(--mantine-color-body)"
            align="flex-start"
            gap="md"
        >

            <Image
                src='/default-match.jpg'
                radius='md'
                h={300}
                w='auto'
                fit='contain'
                onClick={() => router.push("/matching")}
                /> 
                
            <Text
                size='xl'
                fw={700}
                variant="gradient"
                gradient={{ from: 'rgba(102, 66, 4, 1)', to: 'rgba(237, 210, 187, 1)', deg: 175 }}
                onClick={() => router.push("/matching")}
            >
                Find your pet the perfect furriend now!
            </Text>
        </Stack>
    );
}