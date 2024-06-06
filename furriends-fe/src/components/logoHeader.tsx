import { Box, Image } from "@mantine/core";
import { useRouter } from "next/router";

export default function LogoHeader() {
    const router = useRouter();
    return (
        <Box className="flex items-center justify-left w-[70px] h-[70px] m-4">
            <Image
                src='logo-icon.png'
                onClick={() => router.push("/")}
            />   
        </Box>
    );
}