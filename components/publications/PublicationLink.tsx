'use client';

import { incrementViewCount } from '@/lib/actions/publications';
import { ExternalLink } from 'lucide-react';

interface PublicationLinkProps {
    id: number;
    url: string;
    className?: string;
    children?: React.ReactNode;
}

export default function PublicationLink({ id, url, className, children }: PublicationLinkProps) {
    const handleClick = async () => {
        await incrementViewCount(id);
    };

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            onClick={handleClick}
        >
            {children || (
                <>
                    <ExternalLink className="w-4 h-4" />
                    Lihat Publikasi
                </>
            )}
        </a>
    );
}
