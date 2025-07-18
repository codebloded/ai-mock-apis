import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FilterBadge({
  children,
  onRemove,
  className,
}: {
  children: React.ReactNode;
  onRemove: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm",
        "hover:bg-accent hover:text-accent-foreground",
        className,
      )}
    >
      {children}
      <button
        onClick={onRemove}
        className="ml-1 rounded-full p-1 hover:bg-muted"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
