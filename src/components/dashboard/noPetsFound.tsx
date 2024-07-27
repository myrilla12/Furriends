import { Box, Stack, Image, Title } from "@mantine/core";

/**
 * Component displayed when no pets are found to fit the filter conditions.
 *
 * @returns {JSX.Element} The NoPetsFound component.
 */
export default function NoPetsFound() {
    return (
        <div className="flex flex-col h-[48vh] items-center justify-center">
                <Image
                    src="/no-pets-found.png"
                    w={220}
                    alt="Outline of a cat"
                    className="mb-3"
                />
                <Title order={3} className="text-center">No pets found...</Title>
        </div>
    );
}