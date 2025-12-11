'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface ClassData {
    id: number;
    name: string;
    semester: string;
    course: {
        code: string;
        name: string;
    };
}

interface ClassSelectorProps {
    classes: ClassData[];
    selectedClassId?: number;
    onSelectClass: (classId: number) => void;
}

export default function ClassSelector({ classes, selectedClassId, onSelectClass }: ClassSelectorProps) {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | undefined>(selectedClassId);

    useEffect(() => {
        setSelectedId(selectedClassId);
    }, [selectedClassId]);

    const selectedClass = classes.find((c) => c.id === selectedId);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between"
                >
                    {selectedClass
                        ? `${selectedClass.course.name} - ${selectedClass.name}`
                        : "Pilih Kelas..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Cari kelas..." />
                    <CommandList>
                        <CommandEmpty>Kelas tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {classes.map((c) => (
                                <CommandItem
                                    key={c.id}
                                    value={`${c.course.name} ${c.name}`}
                                    onSelect={() => {
                                        setSelectedId(c.id);
                                        onSelectClass(c.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedId === c.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{c.course.name}</span>
                                        <span className="text-xs text-muted-foreground">{c.name} - {c.semester}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
