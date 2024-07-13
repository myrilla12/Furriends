// image from https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fpremium-ai-image%2Fdrawing-puppy-with-sad-face_47289107.htm&psig=AOvVaw0Pwp59pS8u9VtnqqASmdb3&ust=1718829948302000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOiK4-CC5oYDFQAAAAAdAAAAABAE
// if no pets are found to fit filter conditions this component is displayed instead of pet carousel

import { Box, Stack, Image, Title } from "@mantine/core";

/**
 * Component displayed when no pets are found to fit the filter conditions.
 *
 * @returns {JSX.Element} The NoPetsFound component.
 */
export default function NoPetsFound() {
    return (
        <Stack
            align="center"
        >
            <Image
                src="/sadface.png"
                w={400}
                alt="Picture of a sad dog"
            />

            <Title order={2}>No pets found :(</Title>
        </Stack>
    );
}