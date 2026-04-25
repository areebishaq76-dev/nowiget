import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nowiget.vercel.app"),
  title: "NowIGet — Finally Understand Anything",
  description:
    "Describe exactly what you're confused about. Get a clear, human explanation in plain language. No jargon. No textbooks. Just clarity.",
  openGraph: {
    title: "NowIGet — Finally Understand Anything",
    description:
      "Describe exactly what you're confused about. Get a clear, human explanation in plain language. No jargon. No textbooks. Just clarity.",
    type: "website",
    images: [{ url: "/api/og?confusion=Finally understand anything.", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NowIGet — Finally Understand Anything",
    description:
      "Describe exactly what you're confused about. Get a clear, human explanation in plain language. No jargon. No textbooks. Just clarity.",
    images: ["/api/og?confusion=Finally understand anything."],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
