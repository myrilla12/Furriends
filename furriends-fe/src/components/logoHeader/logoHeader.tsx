import { Box, Image } from "@mantine/core";
import { useRouter } from "next/router";
import styles from './LogoHeader.module.css';

export default function LogoHeader() {
    const router = useRouter();
    return (
        <Box className={styles.logoContainer}>
            <Image src='logo-icon.png' onClick={() => router.push("/")} />   
        </Box>
    );
}