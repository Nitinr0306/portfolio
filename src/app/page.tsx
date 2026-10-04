import type { Metadata } from "next";
import { About } from "@/components/home/About";
import { ContactCta } from "@/components/home/ContactCta";
import { Hero } from "@/components/home/Hero";
import { Paths } from "@/components/home/Paths";
import { Work } from "@/components/home/Work";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Paths />
      <Work />
      <About />
      <ContactCta />
    </>
  );
}
