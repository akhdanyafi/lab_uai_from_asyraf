'use client';

import React, { useEffect } from 'react';

interface TimeSelectProps {
    value: string; // HH:mm format
    onChange: (val: string) => void;
    required?: boolean;
    name?: string;
}

export default function TimeSelect({ value, onChange, required, name }: TimeSelectProps) {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    // Initialize if empty but required (or let it be controlled)
    const [hour, minute] = value ? value.split(':') : ['', ''];

    const handleHour = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newHour = e.target.value;
        onChange(`${newHour}:${minute || '00'}`);
    };

    const handleMinute = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMinute = e.target.value;
        onChange(`${hour || '08'}:${newMinute}`);
    };

    return (
        <div className="flex items-center gap-1 w-full">
            <select
                required={required}
                value={hour}
                onChange={handleHour}
                className="w-full px-2 py-2 text-center rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-white cursor-pointer"
            >
                <option value="" disabled className="hidden">Jam</option>
                {hours.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <span className="text-gray-500 font-bold">:</span>
            <select
                required={required}
                value={minute}
                onChange={handleMinute}
                className="w-full px-2 py-2 text-center rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-white cursor-pointer"
            >
                <option value="" disabled className="hidden">Mnt</option>
                {minutes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {name && <input type="hidden" name={name} value={value} />}
        </div>
    );
}
