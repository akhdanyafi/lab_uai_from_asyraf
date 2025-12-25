import { getHeroPhotos } from '@/features/hero-photos/actions';
import HeroCarousel from './HeroCarousel';

export default async function HeroSection() {
    const photos = await getHeroPhotos();

    return (
        <HeroCarousel photos={photos} />
    );
}
