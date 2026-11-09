import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  wide?: boolean; // For header/footer or full-width sections
}

/**
 * Shared Container Component
 * Fluid padding across all breakpoints:
 * - Mobile (<768px): 100% minus fluid 20px padding
 * - Tablet (768px): max-w-[720px]
 * - Small Laptop (1024px): max-w-[1100px]
 * - Standard Laptop (1280px / 1366x768): max-w-[1280px]
 * - Desktop (1440px - 1536px 125% scale): max-w-[1440px]
 * - Ultrawide / 1920px+: max-w-[1680px] (or full fluid with generous margins)
 */
export function Container({ children, className = "", wide = false, ...props }: ContainerProps) {
  return (
    <div
      className={`w-full mx-auto px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 ${
        wide
          ? "max-w-[1800px]"
          : "max-w-[1680px]"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

