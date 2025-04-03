"use client";

import localFont from "next/font/local";
import "./globals.css";
import { DataProvider } from "./context/DataContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen flex flex-col">
      <head>
        <link rel="icon" href="/images/seekerai_logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <DataProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 w-full">{children}</main>
            <footer className="text-center px-4 py-4 w-full bg-white text-black font-bold text-sm mt-auto">
              <p>© 2024 SeekerAI. All rights reserved.</p>
            </footer>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
