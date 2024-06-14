import LogoHeader from "@/components/logoHeader";
import Filters from "@/components/pet-matching/filters";
import PetCarousel from "@/components/pet-matching/petCarousel";
import { Group, Title } from "@mantine/core";

// This page includes the horizontal filter bar followed by carousel of pet profile cards
export default function Matching() {
    return ( 
        <>
            <Group>
            <LogoHeader />
            <Title order={1}>
                Find your pet some furriends
            </Title>
            </Group>
            
            <Filters />
            <PetCarousel />
        </>
    );
}
