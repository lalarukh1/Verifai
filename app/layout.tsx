import type { Metadata } from "next";
import { DM_Mono, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "VerifAI: Fact check social media instantly",
  description:
    "Paste any Instagram or TikTok URL and get an instant AI-powered fact-check report.",
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
      </body>
    </html>
  );
}
