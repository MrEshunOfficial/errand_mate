import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/MainHeader";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { ReduxProvider } from "@/components/ReduxProvider";
import FaviconUpdater from "@/lib/client-api/FaviconUpdater";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ErrandMate",
  description: "ErrandsMate team Incorporated",
  // Removed icons from metadata to avoid conflicts
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" className="scroll-smooth">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          {/* Multiple favicon declarations with cache busting */}
          <link rel="icon" href="/errand_logo.jpg?v=2" type="image/jpeg" />
          <link
            rel="shortcut icon"
            href="/errand_logo.jpg?v=2"
            type="image/jpeg"
          />
          <link rel="apple-touch-icon" href="/errand_logo.jpg?v=2" />
          <meta name="msapplication-TileImage" content="/errand_logo.jpg?v=2" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
        >
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <FaviconUpdater />
              <Header />
              <main className="w-full min-h-[calc(100vh-64px)] p-2">
                {children}
              </main>
            </ThemeProvider>
          </ReduxProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
