import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 text-gray-800 dark:text-gray-200">
      <h1 className="font-display font-bold text-3xl mb-2 text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="text-xs text-gray-500 mb-6">Last updated: November 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-base text-gray-900 dark:text-white mb-2">1. Data We Collect</h2>
          <p>
            We collect your verified name, email address, and mobile phone number for authentication, transactional receipts via Resend/SMS, and digital watermarking on purchased study materials.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 dark:text-white mb-2">2. Payment Security</h2>
          <p>
            Payments are processed securely via Razorpay. We do not store credit card numbers, UPI PINs, or banking passwords on our servers.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-900 dark:text-white mb-2">3. No Third-Party Data Selling</h2>
          <p>
            Your contact details and study progress will never be sold or rented to third-party marketing brokers.
          </p>
        </section>
      </div>
    </div>
  );
}

