import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bet-Analytix - Track Your Betting Performance",
  description: "Professional betting tracking platform with precise metrics, real events, and public tipster profiles",
  keywords: ["betting", "sports betting", "picks", "ROI", "analytics", "tipster"],
  openGraph: {
    title: "Bet-Analytix - Track Your Betting Performance",
    description: "Professional betting tracking platform with precise metrics, real events, and public tipster profiles",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}