import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import { AuthProvider } from "./LoginContext";
import { SpeedInsights } from "@vercel/speed-insights/next"

// g4me green : #22b14c 
// g4me dgreen : #187e37
// g4me gray : #9c9c9c
// g4me dgray : #737373
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Search Thousands of Official Recipes | Recipe4Me",
  description: "Welcome to my website!",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <div className="flex flex-col min-h-[100dvh] w-full min-w-[360px]">
            <Navbar />
            <main className="flex-grow w-full bg-[#ebe8d8] content-center">
              {children}
            </main>
            <Footer />
          </div>
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}