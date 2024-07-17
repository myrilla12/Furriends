import { Community } from "@/utils/definitions";
import { Accordion, Avatar, Box, Button, Group, Text } from "@mantine/core";
import CommunityList from "./communityList";

/**
 * Communities component for displaying communties that user is not a member of.
 *
 * @returns {JSX.Element} The Communities component.
 */
export default function Communities({ communities }: { communities: Community[]; }) {
    
    return (
        <Box w={400}>
            <h1 className="mt-20 text-xl font-bold text-amber-950 border-b-2">Discover Communities</h1>
            <CommunityList communities={communities} mine={false} />
        </Box>
    );
}