import type { Metadata } from "next";
import { fraunces, inter } from "@/styles/fonts";
import { SITE_URL } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "F.F Real Estate Builder & Developers", template: "%s | F.F Real Estate" },
  description:
    "F.F Real Estate Builder & Developers — buying, selling, renting, renovation and property documentation in F.B Area, Dastagir and across Karachi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
