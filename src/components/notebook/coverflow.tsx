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
  return (
    <div
      className="relative w-full flex items-center justify-center overflow-visible"
      style={{
        perspective: "2200px",
        height: "clamp(380px, 65dvh, 720px)",
      }}
    >
      <div className="relative flex items-center justify-center w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {items.map((item, index) => {
          const offset = index - selectedIndex;
          const absOffset = Math.abs(offset);
          const isCenter = offset === 0;

          // Show up to 2 neighbors on each side
          if (absOffset > 2) return null;

          // If a book is open, smoothly part/fade the neighbor books out of the way
          // without abruptly unmounting the active center book
          const dir = offset > 0 ? 1 : -1;
          const closedXExpr =
            absOffset === 0
              ? "0px"
              : absOffset === 1
              ? `calc(${dir} * clamp(150px, 21vw, 350px))`
              : `calc(${dir} * clamp(250px, 36vw, 600px))`;

          const openXExpr = `calc(${dir} * clamp(420px, 55vw, 900px))`;

          // Balanced 3D tilt angles so neighbor covers stay clearly legible (never edge-on -84deg)
          const rotateY =
            absOffset === 0 ? 0 : absOffset === 1 ? dir * -24 : dir * -38;

          const scale =
            absOffset === 0 ? 1 : absOffset === 1 ? 0.86 : 0.73;

          const translateZ =
            absOffset === 0 ? (isOpen ? 40 : 60) : absOffset === 1 ? -60 : -160;

          const opacity = isOpen
            ? isCenter
              ? 1
              : 0
            : absOffset === 0
            ? 1
            : absOffset === 1
            ? 0.9
            : 0.65;

          const zIndex = isCenter ? 40 : 30 - absOffset * 8;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isOpen) return;
                if (isCenter) {
                  onOpenNotebook();
                } else {
                  onSelectIndex(index);
                }
              }}
              className="absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translateX(${isOpen && !isCenter ? openXExpr : closedXExpr}) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
                pointerEvents: isOpen && !isCenter ? "none" : "auto",
                cursor: isCenter ? "default" : "pointer",
                transformStyle: "preserve-3d",
              }}
            >
              <Notebook
                item={item}
                isOpen={isCenter && isOpen}
                isActive={isCenter}
                onOpen={() => {
                  if (isCenter) onOpenNotebook();
                  else onSelectIndex(index);
                }}
                onClose={onCloseNotebook}
                onBuy={onBuy}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
