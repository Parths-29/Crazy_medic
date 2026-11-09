import React from "react";

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 text-gray-800 dark:text-gray-200">
      <h1 className="font-display font-bold text-3xl mb-2 text-gray-900 dark:text-white">Refund & Cancellation Policy</h1>
      <p className="text-xs text-gray-500 mb-6">Last updated: November 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-base text-gray-900 dark:text-white mb-2">1. Nature of Digital Goods</h2>
          <p>
            Due to the immediate access nature of digital downloads and interactive PDFs, all sales are final once content has been unlocked in your library.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 dark:text-white mb-2">2. Defective Files or Technical Errors</h2>
          <p>
            If you encounter a corrupted file, broken pages, or were charged multiple times due to a gateway hiccup, our team will promptly inspect the error and issue a full refund within 3–5 business days.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 dark:text-white mb-2">3. How to Request Support</h2>
          <p>
            Contact us via our Contact Page or email us with your Razorpay Payment ID at <span className="font-semibold text-[#E8443A]">support@thecrazymedic.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}

