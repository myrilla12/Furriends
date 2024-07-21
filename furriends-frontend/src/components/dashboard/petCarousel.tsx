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
}

/**
 * Component for displaying a carousel of pet cards.
 *
 * @param {PetCarouselProps} props - The component props.
 * @param {User} props.user - The authenticated user. 
 * @param {Pet[]} props.pets - The array of pets to display in the carousel.
 * @returns {JSX.Element} The PetCarousel component.
 */
export default function PetCarousel({ user, pets }: PetCarouselProps) {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 1.3521, lng: 103.8198 });
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

            setUserLocation({ lat: data[0].latitude, lng: data[0].longitude })
        };

        fetchLocations();

        const fetchNearbyUsers = async () => {
            const supabase = createClient();

            // get nearby users
            let { data, error } = await supabase
                .rpc('nearby_users', { 
                    lat: userLocation.lat, 
                    long: userLocation.lng 
                })

            if (error) {
                console.error('Error fetching nearby users:', error);
                return;
            }
            setNearbyUsers(data);
        };

        fetchNearbyUsers();
    }, [user, userLocation]);

    const sortedPets = pets.sort((petA, petB) => {
        const ownerA = nearbyUsers?.find(user => user.id === petA.owner_id);
        const ownerB = nearbyUsers?.find(user => user.id === petB.owner_id);
        return (ownerA?.dist_meters || Infinity) - (ownerB?.dist_meters || Infinity);
    })

    const slides = sortedPets.map((pet, index) => (
        <Carousel.Slide key={index}>
            {<PetCard pet={pet} editable={false} chattable={true} />}
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