'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MousePointerClick } from 'lucide-react';

interface HeroFocalPickerProps {
    imageUrl: string;
    initialFocalX?: number;
    initialFocalY?: number;
    onChange: (x: number, y: number) => void;
}

export default function HeroFocalPicker({ imageUrl, initialFocalX = 50, initialFocalY = 50, onChange }: HeroFocalPickerProps) {
    const [focalX, setFocalX] = useState(initialFocalX);
    const [focalY, setFocalY] = useState(initialFocalY);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    // Update parent when local state changes (debounced/throttled conceptually by drag end, but we'll just fire on change)
    useEffect(() => {
        onChange(focalX, focalY);
    }, [focalX, focalY, onChange]);

    const handleInteractionStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        updateFocalPoint(e);
    }, []);

    const handleInteractionMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        updateFocalPoint(e);
    }, [isDragging]);

    const handleInteractionEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleInteractionMove);
            window.addEventListener('mouseup', handleInteractionEnd);
            window.addEventListener('touchmove', handleInteractionMove, { passive: false });
            window.addEventListener('touchend', handleInteractionEnd);
        } else {
            window.removeEventListener('mousemove', handleInteractionMove);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchmove', handleInteractionMove);
            window.removeEventListener('touchend', handleInteractionEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleInteractionMove);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchmove', handleInteractionMove);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, [isDragging, handleInteractionMove, handleInteractionEnd]);

    const updateFocalPoint = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!containerRef.current || !imgRef.current) return;

        // Prevent scrolling when dragging on touch devices
        if (e.type === 'touchmove') {
            e.preventDefault();
        }

        const containerRect = containerRef.current.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent | MouseEvent).clientX;
            clientY = (e as React.MouseEvent | MouseEvent).clientY;
        }

        // Calculate click position relative to container
        const x = clientX - containerRect.left;
        const y = clientY - containerRect.top;

        // Convert to percentage (0-100)
        let percentX = Math.round((x / containerRect.width) * 100);
        let percentY = Math.round((y / containerRect.height) * 100);

        // Clamp to 0-100
        percentX = Math.max(0, Math.min(100, percentX));
        percentY = Math.max(0, Math.min(100, percentY));

        setFocalX(percentX);
        setFocalY(percentY);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
                <p className="flex items-center gap-1.5">
                    <MousePointerClick className="w-4 h-4 text-[#0F4C81]" />
                    Klik dan geser pada gambar untuk menentukan area fokus.
                </p>
                <div className="font-mono bg-gray-100 px-2 py-1 rounded">
                    X: {focalX}% | Y: {focalY}%
                </div>
            </div>

            <div
                className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-crosshair select-none touch-none aspect-video md:aspect-[21/9] w-full"
                ref={containerRef}
                onMouseDown={handleInteractionStart}
                onTouchStart={handleInteractionStart}
            >
                {/* 
                    The image itself is rendered using object-fit: cover 
                    and its object-position is updated in real-time based on focalX and focalY. 
                */}
                <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Focal point preview"
                    className="w-full h-full object-cover transition-none select-none pointer-events-none"
                    style={{ objectPosition: `${focalX}% ${focalY}%` }}
                    draggable={false}
                />

                {/* Crosshair indicator */}
                <div
                    className="absolute w-6 h-6 -ml-3 -mt-3 pointer-events-none z-10"
                    style={{ left: `${focalX}%`, top: `${focalY}%` }}
                >
                    <div className="absolute inset-0 border-2 border-white rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.5)]"></div>
                    <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-[0_0_2px_rgba(0,0,0,0.5)]"></div>
                    {/* Cross lines */}
                    <div className="absolute top-1/2 -left-2 w-10 h-px bg-white/50 -translate-y-1/2 hidden"></div>
                    <div className="absolute left-1/2 -top-2 w-px h-10 bg-white/50 -translate-x-1/2 hidden"></div>
                </div>
            </div>

            <p className="text-xs text-gray-500">
                Area gambar yang tampil di dalam kotak ini merepresentasikan potongan gambar yang akan dilihat pengguna di homepage (rasio layar lebar).
            </p>
        </div>
    );
}
