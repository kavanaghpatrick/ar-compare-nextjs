import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ComparisonProvider } from "@/contexts/ComparisonContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AR Compare - Compare AR Glasses & Smart Glasses',
  description: 'Compare the latest AR glasses and smart glasses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ComparisonProvider>
          {children}
        </ComparisonProvider>
      </body>
    </html>
  );
}