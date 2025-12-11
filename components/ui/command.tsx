'use client';

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

const CommandContext = React.createContext<{
    search: string;
    setSearch: (search: string) => void;
} | null>(null);

const Command = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const [search, setSearch] = React.useState("");
        return (
            <CommandContext.Provider value={{ search, setSearch }}>
                <div
                    ref={ref}
                    className={cn(
                        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
                        className
                    )}
                    {...props}
                />
            </CommandContext.Provider>
        );
    }
)
Command.displayName = "Command"

const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
        const context = React.useContext(CommandContext);
        return (
            <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                    ref={ref}
                    className={cn(
                        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    placeholder="Search..."
                    value={context?.search}
                    onChange={(e) => context?.setSearch(e.target.value)}
                    {...props}
                />
            </div>
        );
    }
)
CommandInput.displayName = "CommandInput"

const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
            {...props}
        />
    )
)
CommandList.displayName = "CommandList"

const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    // In a real implementation this would check if any items are visible
    // Here we just render it, relying on user to hide/show or just showing it at bottom?
    // Actually, making it smart is hard without counting children.
    // For now we'll just return null to avoid clutter or always show? 
    // Let's make it a simple div.
    return <div ref={ref} className="py-6 text-center text-sm" {...props} />;
})
CommandEmpty.displayName = "CommandEmpty"

const CommandGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
                className
            )}
            {...props}
        />
    )
)
CommandGroup.displayName = "CommandGroup"

const CommandItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string, onSelect?: (value: string) => void }
>(
    ({ className, value, onSelect, ...props }, ref) => {
        const context = React.useContext(CommandContext);
        // Basic filtering
        const matches = !context?.search || value.toLowerCase().includes(context.search.toLowerCase());

        if (!matches) return null;

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground",
                    className
                )}
                onClick={() => onSelect && onSelect(value)}
                {...props}
            />
        );
    }
)
CommandItem.displayName = "CommandItem"

export {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
}
