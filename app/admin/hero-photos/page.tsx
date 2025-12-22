import { getHeroPhotos } from '@/lib/actions/hero-photos';
import HeroPhotoManager from './_components/HeroPhotoManager';

export default async function HeroPhotosPage() {
    const photos = await getHeroPhotos();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Foto Hero Homepage</h1>
            </div>

            <HeroPhotoManager initialPhotos={photos} />
        </div>
    );
}
