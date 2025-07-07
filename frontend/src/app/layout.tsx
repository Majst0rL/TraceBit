import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./header";
import Footer from "./footer";
import ClientLayout from "./clientlayout";
import { TabProvider } from "../context/TabContext"; // ✅ Dodano!

export const metadata: Metadata = {
  title: "TraceBit",
  description: "Browser fingerprint analytics",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen antialiased">
        <Navbar />
        <TabProvider> {/* ✅ OVITJE */}
          <ClientLayout>{children}</ClientLayout>
        </TabProvider>
        <Footer />
      </body>
    </html>
  );
}
