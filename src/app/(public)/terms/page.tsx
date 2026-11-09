import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 text-gray-800 dark:text-gray-200">
      <h1 className="font-display font-bold text-3xl mb-2 text-gray-900 dark:text-white">Terms of Service</h1>
      <p className="text-xs text-gray-500 mb-6">Last updated: November 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-base text-gray-900 dark:text-white mb-2">1. Educational Disclaimer</h2>
          <p>
            "The Crazy Medic" by Vismay Sharma provides digital study notes and visual summaries designed exclusively for academic and medical examination preparation. The materials provided do not constitute clinical guidance, official medical diagnosis, or treatment protocols.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 dark:text-white mb-2">2. Digital Products & Anti-Piracy Watermarking</h2>
          <p>
            All purchased notes are view-only digital materials rendered securely within our web application. In order to protect intellectual property, each page is burned with a dynamic purchaser watermark displaying the buyer's verified name, email address, phone number, and order ID.
          </p>
          <p className="mt-2">
            Unauthorized distribution, sharing, or scraping of watermarked files will lead to immediate license revocation and account termination.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 dark:text-white mb-2">3. Device Limits</h2>
          <p>
            Purchasers are permitted up to two (2) concurrent active devices to access their personal library. Active devices may be managed and reset within the user profile.
          </p>
        </section>
      </div>
    </div>
  );
}

