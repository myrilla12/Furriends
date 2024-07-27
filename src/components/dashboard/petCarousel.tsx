import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { Button, Paper, Title, useMantineTheme, Text } from '@mantine/core';
import { Pet } from '@/utils/definitions';
import PetCard from '../account/petCard';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/component';
import { User } from '@supabase/supabase-js';

interface PetCarouselProps {
    user: User;
    pets: Pet[];
    fetch: boolean;
}

/**
 * Component for displaying a carousel of pet cards.
 *
 * @param {PetCarouselProps} props - The component props.
 * @param {User} props.user - The authenticated user. 
 * @param {Pet[]} props.pets - The array of pets to display in the carousel.
 * @param {boolean} props.fetch - Whether nearby users should be fetched or not. 
 * @returns {JSX.Element} The PetCarousel component.
 */
export default function PetCarousel({ user, pets, fetch }: PetCarouselProps) {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const [nearbyUsers, setNearbyUsers] = useState<{ dist_meters: number; id: string; lat: number; long: number; username: string;}[] | null>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            const supabase = createClient();

            // get user latitude and longtitude
            const { data, error } = await supabase
                .rpc('get_user_lat_lng', {
                    user_id: user.id,
                });

            if (error) {
                console.error('Error fetching locations:', error);
                return;
            }

            // get nearby users
            let { data: NearbyUsersData, error: NearbyUsersError } = await supabase
                .rpc('nearby_users', { 
                    lat: data[0].latitude, 
                    long: data[0].longitude 
                })

            if (NearbyUsersError) {
                console.error('Error fetching nearby users:', NearbyUsersError);
                return;
            }
            setNearbyUsers(NearbyUsersData);
        };

        fetchLocations();
    }, [user, fetch]);

    // sort pets by owners' distance & store distance in pet object
    const sortedPets = pets.map(pet => {
        const owner = nearbyUsers?.find(user => user.id === pet.owner_id);
        const distance = owner ? owner.dist_meters : Infinity;
        return { ...pet, distance };
    }).sort((petA, petB) => petA.distance - petB.distance);

    const slides = sortedPets.map((pet, index) => (
        <Carousel.Slide key={index}>
            {<PetCard pet={pet} editable={false} chattable={true} distance={(pet.distance / 1000).toFixed(1)}/>}
        </Carousel.Slide>
    ));

    return (
        <Carousel
            mt='xl'
            slideSize={{ base: '100%', sm: '33.33%' }}
            slideGap={{ base: 'xl', sm: 10 }}
            align='start'
            slidesToScroll={mobile ? 1 : 2}
        >
            {slides}
        </Carousel>
    );
}