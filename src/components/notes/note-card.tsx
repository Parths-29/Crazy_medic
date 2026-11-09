import React from "react";
import Link from "next/link";
import { Book } from "@/components/ui/book";
import { SampleNote } from "@/seed/data";
import { Star, ShieldCheck, ArrowRight } from "lucide-react";
import { formatINR } from "@/lib/utils";

export function NoteCard({ note }: { note: SampleNote }) {
  const discountPercent = Math.round(((note.mrp - note.price) / note.mrp) * 100);

  return (
    <Link
      href={`/notes/${note.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#141E2C] border border-gray-100 dark:border-gray-800 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div>
        {/* Book Preview */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-gray-50/70 dark:bg-gray-800/30 rounded-xl mb-3 overflow-hidden p-2">
          <Book
            title={note.title}
            width={140}
            color={note.color}
            variant="stripe"
            textured
          />
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8443A] text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          <span className="absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/90 dark:bg-black/80 backdrop-blur-sm text-gray-700 dark:text-gray-300">
            {note.pageCount} Pages
          </span>
        </div>

        {/* Note Metadata */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-semibold text-[#E8443A] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
            {note.yearTag}
          </span>
          <div className="flex items-center gap-0.5 text-[11px] text-amber-500 font-bold ml-auto">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
            <span>{note.rating}</span>
            <span className="text-gray-400 text-[10px] font-normal">({note.ratingCount})</span>
          </div>
        </div>

        <h3 className="font-display font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#E8443A] transition">
          {note.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 mb-3">
          {note.tagline}
        </p>
      </div>

      {/* Pricing and Action */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {formatINR(note.price)}
            </span>
            {note.mrp > note.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatINR(note.mrp)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
            <ShieldCheck className="w-3 h-3" /> Instant access
          </span>
        </div>

        <button className="h-8 px-2.5 sm:px-3 rounded-lg bg-[#0F2B3C] dark:bg-white text-white dark:text-[#0F2B3C] text-xs font-semibold flex items-center gap-1 group-hover:bg-[#E8443A] group-hover:text-white transition">
          <span>View</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </Link>
  );
}

