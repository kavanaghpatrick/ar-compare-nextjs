import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/navigation.css";
import "../styles/quickview.css";
import { ComparisonProvider } from "@/contexts/ComparisonContext";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AR Compare - Compare AR Glasses & Smart Glasses',
    template: '%s | AR Compare'
  },
  description: 'Compare the latest AR glasses and smart glasses. Find detailed specs, prices, and reviews.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ComparisonProvider>
          {children}
        </ComparisonProvider>
      </body>
    </html>
  );
}