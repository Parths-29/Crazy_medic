"use client";

import React, { useState } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";
import { InstagramIcon } from "@/components/shared/instagram-icon";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-2">
          Contact The Crazy Medic
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Have questions about notes, payment queries, or study inquiries? Reach out below.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl bg-white dark:bg-[#141E2C] border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center gap-2 hover:border-pink-300 transition"
        >
          <InstagramIcon className="w-5 h-5 text-pink-500" />
          <span className="text-xs font-bold text-gray-900 dark:text-white">Instagram DM</span>
          <span className="text-[10px] text-gray-400">@thecrazymedic</span>
        </a>

        <a
          href="mailto:support@thecrazymedic.com"
          className="p-4 rounded-2xl bg-white dark:bg-[#141E2C] border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center gap-2 hover:border-teal-300 transition"
        >
          <Mail className="w-5 h-5 text-teal-500" />
          <span className="text-xs font-bold text-gray-900 dark:text-white">Email Support</span>
          <span className="text-[10px] text-gray-400">support@thecrazymedic.com</span>
        </a>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#141E2C] border border-gray-100 dark:border-gray-800 shadow-sm">
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
              ✓
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Message Dispatched!</h3>
            <p className="text-xs text-gray-500 mt-1">Vismay or our study support team will reply within 24 hours.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Dr. / Medical Student"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8443A]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@college.edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8443A]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Message / Query
              </label>
              <textarea
                rows={4}
                required
                placeholder="Ask about a specific subject, order receipt, or study advice..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8443A]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] py-3 rounded-xl bg-[#0F2B3C] text-white font-bold text-sm shadow hover:bg-black transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

