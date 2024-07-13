import { BuildingStorefrontIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Button, Group } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";

export default function FeedLinks() {
    const pathname = usePathname();
    const router = useRouter();
    
    return (
        <Group>
            <Button
                leftSection={<UsersIcon className="w-6"/>}
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
                leftSection={<BuildingStorefrontIcon className="w-6"/>}
                variant={pathname === '/services' ? 'filled' : 'outline'}
                color='#6d543e'
                radius='xl'
                onClick={() => {
                    router.push('/feed/services');
                }}
            >
                Pet services
            </Button>
        </Group>
    );
}