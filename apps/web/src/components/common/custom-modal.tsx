import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;

  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,

  maxWidth = "md",
}: CustomModalProps) {
  const maxWidthClasses = {
    sm: "sm:max-w-[500px]",
    md: "sm:max-w-[800px]",
    lg: "sm:max-w-[1024px]",
    xl: "sm:max-w-[1280px]",
  };

  const defaultFooter = (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit">Submit</Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "w-full",
          maxWidthClasses[maxWidth],
          className
        )}
      >
        <DialogHeader className="relative border-b pb-4">
          <DialogTitle>{title}</DialogTitle>

        </DialogHeader>
        <div className="py-4">{children}</div>

        <div className="border-t pt-4">
          {footer || defaultFooter}
        </div>
      </DialogContent>
    </Dialog>
  );
}
