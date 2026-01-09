'use client';

import { markAllNotificationsRead } from '@/features/dashboard/actions';
import { Check } from 'lucide-react';
import { useTransition } from 'react';

export function MarkAllReadButton() {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            await markAllNotificationsRead();
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
        >
            <Check className="w-3 h-3" />
            {isPending ? 'Memproses...' : 'Tandai Semua Sudah Dibaca'}
        </button>
    );
}
