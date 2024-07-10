import { Button, Group } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";

export default function FeedLinks() {
    const pathname = usePathname();
    const router = useRouter();
    
    return (
        <Group>
                    <Button
                        variant={pathname === '/feed' ? 'filled' : 'outline'}
                        color='#6d543e'
                        radius='xl'
                        onClick={() => {
                            router.push('/feed');
                        }}
                    >
                        Community feed
                    </Button>
                    <Button
                        variant={pathname === '/services' ? 'filled' : 'outline'}
                        color='#6d543e'
                        radius='xl'
                        onClick={() => {
                            router.push('/services');
                        }}
                    >
                        Pet services
                    </Button>
                </Group>
    );
}