'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Placeholder for carousel images
    const slides = [
        { id: 1, content: "FOTOKegiatan 1", color: "bg-gray-300" },
        { id: 2, content: "FOTOKegiatan 2", color: "bg-gray-400" },
        { id: 3, content: "FOTOKegiatan 3", color: "bg-gray-300" },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="w-full h-[400px] relative bg-gray-200 flex items-center justify-center overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        } ${slide.color}`}
                >
                    <h2 className="text-2xl font-bold text-gray-700">{slide.content}</h2>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute left-4 p-2 bg-white/50 hover:bg-white/80 rounded-full transition-colors"
            >
                <ChevronLeft className="w-8 h-8 text-gray-700" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 p-2 bg-white/50 hover:bg-white/80 rounded-full transition-colors"
            >
                <ChevronRight className="w-8 h-8 text-gray-700" />
            </button>
        </div>
    );
}
