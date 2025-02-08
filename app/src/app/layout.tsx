import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Trust but Verify AI",
  description: "Trust but Verify AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen flex flex-col">
      <head>{/* <link rel="icon" href="/favicon.ico" /> */}</head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 w-full">{children}</main>
          <footer className="text-center p-4 w-full bg-white text-black border border-black font-bold text-md mt-auto">
            <p>© 2024 Trust but Verify AI. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
