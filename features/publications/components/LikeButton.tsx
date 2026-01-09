'use client';

import { useState, useTransition, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { togglePublicationLike, getPublicationLikeCount, checkUserLikedPublication } from '@/features/publications/actions';

interface LikeButtonProps {
    publicationId: number;
    userId?: number; // null if not logged in
    initialLiked?: boolean;
    initialLikeCount?: number;
}

export default function LikeButton({ publicationId, userId, initialLiked, initialLikeCount }: LikeButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [liked, setLiked] = useState(initialLiked ?? false);
    const [likeCount, setLikeCount] = useState(initialLikeCount ?? 0);
    const [loaded, setLoaded] = useState(initialLikeCount !== undefined);

    // Fetch data if not provided initially (for client components)
    useEffect(() => {
        if (!loaded) {
            const fetchData = async () => {
                const count = await getPublicationLikeCount(publicationId);
                setLikeCount(count);
                if (userId) {
                    const isLiked = await checkUserLikedPublication(publicationId, userId);
                    setLiked(isLiked);
                }
                setLoaded(true);
            };
            fetchData();
        }
    }, [publicationId, userId, loaded]);

    const handleLike = () => {
        if (!userId) {
            // Not logged in - show message or redirect
            alert('Silakan login untuk menyukai publikasi');
            return;
        }

        startTransition(async () => {
            const result = await togglePublicationLike(publicationId, userId);
            setLiked(result.liked);
            setLikeCount(result.likeCount);
        });
    };

    return (
        <button
            onClick={handleLike}
            disabled={isPending || !loaded}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${liked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
        >
            <Heart
                className={`w-4 h-4 transition-transform ${liked ? 'fill-red-500 text-red-500 scale-110' : ''}`}
            />
            <span>{likeCount}</span>
        </button>
    );
}
