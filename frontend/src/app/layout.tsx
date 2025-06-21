import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AccessibilityProvider } from "../components/AccessibilityProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AODA Accessibility Checker | Canadian Business Compliance",
  description: "Ensure your website meets AODA (Accessibility for Ontarians with Disabilities Act) and WCAG 2.0 AA standards. Professional accessibility testing for Canadian businesses.",
  keywords: ["AODA", "accessibility", "WCAG", "Canadian", "Ontario", "compliance", "disabilities"],
  authors: [{ name: "AODA Accessibility Checker" }],
  openGraph: {
    title: "AODA Accessibility Checker",
    description: "Professional accessibility testing for Canadian businesses",
    type: "website",
    locale: "en_CA",
  },
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
        <meta name="theme-color" content="#dc2626" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AccessibilityProvider>
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-red-600 text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
          >
            Skip to main content
          </a>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  );
}
