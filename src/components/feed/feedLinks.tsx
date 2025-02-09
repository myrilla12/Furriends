import { BuildingStorefrontIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Button, Group } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";

/**
 * Component for navigation links in the feed.
 *
 * @returns {JSX.Element} The FeedLinks component.
 */
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
                variant={pathname === '/feed/services' ? 'filled' : 'outline'}
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