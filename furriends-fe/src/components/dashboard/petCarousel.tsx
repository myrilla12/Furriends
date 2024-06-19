import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { Button, Paper, Title, useMantineTheme, Text } from '@mantine/core';
import { Pet } from '@/utils/definitions';
import PetCard from '../account/petCard';

interface PetCarouselProps {
  pets: Pet[];
}

export default function PetCarousel({ pets }: PetCarouselProps) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = pets.map((pet) => (
    <Carousel.Slide>
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