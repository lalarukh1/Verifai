import type { Metadata } from "next";
import { DM_Mono, Lora } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${dmMono.variable} ${lora.variable} antialiased font-mono`}
        style={{ backgroundColor: "#070711" }}
      >
        {children}
      </body>
    </html>
  );
}
