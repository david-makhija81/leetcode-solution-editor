import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeetCode Solution Editor",
  description: "A collaborative editor for LeetCode solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${pressStart.variable} antialiased`}
        >
          <div className="grid-bg"></div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
