import type { Metadata } from "next";
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
  title: "AI SaaS Platform",
  description: "AI-powered platform for building, deploying, and scaling intelligent applications",
  icons: {
    icon: "https://www.gsgroups.net/gslogo.png",
    apple: "https://www.gsgroups.net/gslogo.png",
  },
  openGraph: {
    title: "AI SaaS Platform",
    description: "AI-powered platform for building, deploying, and scaling intelligent applications",
    images: [
      {
        url: "https://www.gsgroups.net/gslogo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
