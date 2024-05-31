import { Box, Image } from "@mantine/core";
import { useRouter } from "next/router";

export default function LogoHeader() {
    const router = useRouter();
    return (
        <Box>
            <Image src='logo-cropped.png' onClick={() => router.push("/")}/>   
        </Box>
    );
}