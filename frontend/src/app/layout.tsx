// C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./header";
import Footer from "./footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TraceBit",
  description: "Browser fingerprint analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen antialiased">
        <Navbar />
        <main className="flex-grow mt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
