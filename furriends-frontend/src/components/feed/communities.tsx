import { Box } from "@mantine/core";

/**
 * Communities component for displaying communties that user is not a member of.
 *
 * @returns {JSX.Element} The Communities component.
 */
export default function Communities() {
    return (
        <Box w={350}>
            <h1 className="mt-20 text-xl font-bold text-amber-950 border-b-2">Discover Communities</h1>
        </Box>
    );
}