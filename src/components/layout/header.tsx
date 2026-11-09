"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Heart, X, MessageSquare } from "lucide-react";
import { InstagramIcon } from "@/components/shared/instagram-icon";

export function CreatorPill() {
  const [openAbout, setOpenAbout] = useState(false);

  return (
    <>
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[92%] sm:w-auto">
        <div
          onClick={() => setOpenAbout(true)}
          className="cursor-pointer flex items-center justify-between sm:justify-start gap-2.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#141E2C]/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all"
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-[#E8443A] to-[#3ECFB4] p-[1.5px] shrink-0">
            <div className="w-full h-full rounded-full bg-[#0F2B3C] flex items-center justify-center text-white font-bold text-xs">
              VS
            </div>
          </div>
          <div className="flex flex-col text-left leading-tight pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight">The Crazy Medic</span>
              <span className="text-[10px] bg-[#E8443A]/10 text-[#E8443A] font-semibold px-1.5 py-0.2 rounded-full">Doc</span>
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">by Vismay Sharma</span>
          </div>

          <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700 hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
            <span>Tap for Bio</span>
          </div>
        </div>
      </div>

      {/* About Sheet Dialog */}
      {openAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#141E2C] rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setOpenAbout(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E8443A] to-[#3ECFB4] p-1 flex items-center justify-center shadow-md">
                <div className="w-full h-full rounded-full bg-[#0F2B3C] flex items-center justify-center text-white font-bold text-lg">
                  VS
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-gray-50">Vismay Sharma</h3>
                <p className="text-sm text-[#E8443A] font-medium">The Crazy Medic • Med Educator</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
              Medical student & biology educator passionate about simplifying terrifying MBBS & NEET concepts through crisp hand-illustrated notes, visual algorithms, and memory pegs.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-center">
                <span className="block text-lg font-bold text-[#0F2B3C] dark:text-white">10,000+</span>
                <span className="text-xs text-gray-500">Students Helped</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-center">
                <span className="block text-lg font-bold text-[#E8443A]">100%</span>
                <span className="text-xs text-gray-500">Exam Focused</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow hover:opacity-95"
              >
                <InstagramIcon className="w-4 h-4" />
                Follow on Instagram (@thecrazymedic)
              </a>
              <Link
                href="/notes"
                onClick={() => setOpenAbout(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#0F2B3C] dark:bg-white dark:text-[#0F2B3C] text-white font-medium text-sm shadow hover:opacity-90"
              >
                <BookOpen className="w-4 h-4" />
                Browse Handwritten Notes
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/70 dark:bg-[#0B111A]/70 border-b border-gray-100 dark:border-gray-800 pt-14 pb-3 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8443A] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            +
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base leading-none text-gray-900 dark:text-white">
              The Crazy Medic
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">by Vismay Sharma</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/notes" className="text-gray-600 dark:text-gray-300 hover:text-[#E8443A] transition">
            Notes Catalog
          </Link>
          <Link href="/library" className="text-gray-600 dark:text-gray-300 hover:text-[#E8443A] transition">
            My Library
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            Instagram
          </a>
        </nav>
      </div>
    </header>
  );
}

