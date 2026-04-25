import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NowIGet — Finally Understand Anything",
  description:
    "Describe exactly what you're confused about. Get a clear, human explanation in plain language. No jargon. No textbooks. Just clarity.",
  openGraph: {
    title: "NowIGet — Finally Understand Anything",
    description:
      "Describe exactly what you're confused about. Get a clear, human explanation in plain language. No jargon. No textbooks. Just clarity.",
    type: "website",
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
