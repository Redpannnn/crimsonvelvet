import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "The Wedding of Tama & Septi — 10 Juli 2027",
  description:
    "Undangan pernikahan Tama & Septi. Sabtu, 10 Juli 2027 di Ayana Jakarta, Jl Jenderal Sudirman Kav. 10-11.",
  openGraph: {
    title: "The Wedding of Tama & Septi",
    description:
      "We invite you to the wedding of Tama & Septi — Sabtu, 10 Juli 2027, Ayana Jakarta.",
    images: ["/og.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Wedding of Tama & Septi",
    description:
      "We invite you to the wedding of Tama & Septi — Sabtu, 10 Juli 2027, Ayana Jakarta.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#12060a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#12060a] text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
