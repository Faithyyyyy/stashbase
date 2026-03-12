import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CollectionsProvider } from "@/context/CollectionContext";
import { AddStashProvider } from "@/context/AddStashContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stashbase",
  description:
    "Collect, organise, and rediscover everything that inspires you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistSans.className}  ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CollectionsProvider>
            <AddStashProvider>{children}</AddStashProvider>
          </CollectionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
