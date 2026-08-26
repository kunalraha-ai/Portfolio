import type { Metadata, Viewport } from "next";
import { Cinzel, Geist } from "next/font/google";
import "./globals.css";

const displayFont = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Kunal Raha | AI Systems Engineer",
    template: "%s | Kunal Raha",
  },
  description:
    "Kunal Raha builds production-grade AI systems, autonomous agent pipelines, full-stack platforms, and data infrastructure.",
  keywords: [
    "Kunal Raha",
    "AI engineer",
    "machine learning",
    "autonomous agents",
    "Next.js developer",
    "OmniProcure",
  ],
  authors: [{ name: "Kunal Raha" }],
  creator: "Kunal Raha",
  openGraph: {
    type: "website",
    title: "Kunal Raha | AI Systems Engineer",
    description: "Autonomous systems built for the real world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kunal Raha | AI Systems Engineer",
    description: "Autonomous systems built for the real world.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070a0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
