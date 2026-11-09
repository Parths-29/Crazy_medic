"use client";

import { useEffect, useState } from "react";

interface ResponsiveProp<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

export function useResponsive<T>(value: T | ResponsiveProp<T>): T {
  const [current, setCurrent] = useState<T>(() => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const responsive = value as ResponsiveProp<T>;
      return responsive.sm ?? responsive.md ?? responsive.lg ?? responsive.xl ?? (value as T);
    }
    return value as T;
  });

  useEffect(() => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      setCurrent(value as T);
      return;
    }

    const responsive = value as ResponsiveProp<T>;

    const update = () => {
      const width = window.innerWidth;
      if (width >= 1280 && responsive.xl !== undefined) setCurrent(responsive.xl);
      else if (width >= 1024 && responsive.lg !== undefined) setCurrent(responsive.lg);
      else if (width >= 768 && responsive.md !== undefined) setCurrent(responsive.md);
      else if (responsive.sm !== undefined) setCurrent(responsive.sm);
      else if (responsive.md !== undefined) setCurrent(responsive.md);
      else setCurrent(value as unknown as T);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [value]);

  return current;
}

