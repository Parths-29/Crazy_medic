"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const fancyButtonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-60 shrink-0 rounded-xl active:scale-[0.98] shadow-md",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-[var(--navy)] ring-1 ring-[var(--coral)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_8px_rgba(255,111,89,0.25)]",
        navy:
          "bg-[var(--navy-2)] hover:bg-[var(--navy)] text-[var(--cream)] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
        outline:
          "border border-white/15 bg-white/5 hover:bg-white/10 text-[var(--cream)]",
      },
      size: {
        default: "h-11 px-4 py-2.5 gap-2",
        sm: "h-9 px-3 py-1.5 gap-1.5 text-xs rounded-lg",
        lg: "h-12 px-5 py-3 gap-2.5 text-base rounded-xl",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface FancyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fancyButtonVariants> {
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ children, size, variant, leftSection, rightSection, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(fancyButtonVariants({ variant, size }), className)}
        {...props}
      >
        {leftSection && <span className="shrink-0">{leftSection}</span>}
        <span className="px-0.5">{children}</span>
        {rightSection && <span className="shrink-0">{rightSection}</span>}
      </button>
    );
  }
);

FancyButton.displayName = "FancyButton";

export default FancyButton;

