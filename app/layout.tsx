import type { Metadata } from "next";
import { DM_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const APP_URL = "https://verifai-it.app";

export const metadata: Metadata = {
  title: "VerifAI: Fact check social media instantly",
  description:
    "Paste any Instagram or TikTok URL and get an instant AI-powered fact-check report.",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "VerifAI: Fact check social media instantly",
    description:
      "Paste any Instagram or TikTok URL and get an instant AI-powered fact-check report.",
    url: APP_URL,
    siteName: "VerifAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VerifAI: Fact check social media instantly",
    description:
      "Paste any Instagram or TikTok URL and get an instant AI-powered fact-check report.",
    site: "@verifaiapp",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${dmMono.variable} ${inter.variable} antialiased`}
        style={{
          backgroundColor: "#060E1A",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          overflowX: "hidden",
          color: "#F0F9FF",
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
