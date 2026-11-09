import React from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { IntroPageClient } from "@/components/intro/intro-page-client";

export const metadata: Metadata = {
  title: "The Crazy Medic — by Vismay Sharma | Handwritten Medical Notes",
  description:
    "Handwritten revision summaries covering high-yield MBBS university exams. Ophthalmology, Surgery, Paediatrics, OBGYN, ENT and PSM by Vismay Sharma.",
  openGraph: {
    title: "The Crazy Medic — by Vismay Sharma",
    description:
      "Handwritten medical notes built for fast revision in university prof exams.",
    type: "website",
    siteName: "The Crazy Medic",
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ demo?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();

  const demoUser =
    params?.demo === "user"
      ? { name: "Ananya Sharma", email: "ananya@aiims.edu" }
      : null;

  return (
    <IntroPageClient
      user={session?.user || demoUser}
      initialTransition={params?.demo === "transition"}
    />
  );
}
