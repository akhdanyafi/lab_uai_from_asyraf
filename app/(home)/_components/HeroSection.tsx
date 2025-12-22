import { getHeroPhotos } from '@/lib/actions/hero-photo';
import HeroCarousel from './HeroCarousel';

export default async function HeroSection() {
    const photos = await getHeroPhotos();

    return (
        <HeroCarousel photos={photos} />
    );
}
