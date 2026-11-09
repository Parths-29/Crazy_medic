"use client";

import React from "react";
import { NotebookItem } from "./notebook-data";
import { Notebook } from "./notebook";

interface CoverflowProps {
  items: NotebookItem[];
  selectedIndex: number;
  isOpen: boolean;
  onSelectIndex: (index: number) => void;
  onOpenNotebook: () => void;
  onCloseNotebook: () => void;
  onBuy: () => void;
}

export function Coverflow({
  items,
  selectedIndex,
  isOpen,
  onSelectIndex,
  onOpenNotebook,
  onCloseNotebook,
  onBuy,
}: CoverflowProps) {
  const currentItem = items[selectedIndex] || items[0];

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-visible"
      style={{
        perspective: "1600px",
        height: "clamp(340px, 58dvh, 680px)",
      }}
    >
      {/* If notebook is open, show only the active spread centered */}
      {isOpen ? (
        <div className="z-30">
          <Notebook
            item={currentItem}
            isOpen={true}
            onOpen={onOpenNotebook}
            onClose={onCloseNotebook}
            onBuy={onBuy}
          />
        </div>
      ) : (
        /* 3D Carousel Coverflow of closed notebooks */
        <div className="relative flex items-center justify-center w-full h-full">
          {items.map((item, index) => {
            const offset = index - selectedIndex;
            const isCenter = offset === 0;

            // Render 2 visible neighbors per side on desktop, 1 on mobile
            if (Math.abs(offset) > 2) return null;

            // STEP 2: Larger scale, wider rotation spread, smaller dimming
            const xOffset = offset * 210; // wider spread so notebooks stand proud
            const rotateY = offset * -42; // crisp 3D tilt angle
            const scale = isCenter ? 1 : 0.88 - Math.abs(offset) * 0.07;
            const opacity = isCenter ? 1 : Math.max(0.45, 0.78 - Math.abs(offset) * 0.18);
            const zIndex = 30 - Math.abs(offset) * 6;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isCenter) {
                    onOpenNotebook();
                  } else {
                    onSelectIndex(index);
                  }
                }}
                className="absolute transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: `translateX(${xOffset}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  opacity,
                  zIndex,
                  transformStyle: "preserve-3d",
                }}
              >
                <Notebook
                  item={item}
                  isOpen={false}
                  onOpen={() => {
                    if (isCenter) onOpenNotebook();
                    else onSelectIndex(index);
                  }}
                  onClose={onCloseNotebook}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
