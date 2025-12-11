'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

const PopoverContext = React.createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
} | null>(null);

const Popover = ({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) => {
    const [internalOpen, setInternalOpen] = React.useState(false);

    // Controlled or uncontrolled
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const setOpen = React.useCallback((newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen);
        }
        if (onOpenChange) {
            onOpenChange(newOpen);
        }
    }, [isControlled, onOpenChange]);

    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, setOpen]);

    return (
        <PopoverContext.Provider value={{ open: isOpen, setOpen }}>
            <div ref={containerRef} className="relative inline-block text-left">
                {children}
            </div>
        </PopoverContext.Provider>
    );
};

const PopoverTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }>(
    ({ children, asChild, onClick, ...props }, ref) => {
        const context = React.useContext(PopoverContext);

        // If asChild is true, we should clone the child and add the onClick handler
        // But for simplicity in this mock, we'll wrap it if not compliant, or just attach handlers

        return (
            <div
                ref={ref}
                onClick={(e) => {
                    if (onClick) onClick(e);
                    context?.setOpen(!context.open);
                }}
                {...props}
            >
                {children}
            </div>
        );
    }
);
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
        const context = React.useContext(PopoverContext);

        if (!context?.open) return null;

        return (
            <div
                ref={ref}
                className={cn(
                    "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
