import type { Metadata, Viewport } from "next";
import { Anton, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: "500",
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "poolbar — pool · bar · desk",
  description:
    "A members' club where work meets water. Heated pool, the kitchen open from breakfast to last call, and a desk to call your own.",
  openGraph: {
    title: "poolbar — pool · bar · desk",
    description:
      "A members' club where work meets water. Heated pool, full kitchen, long bar, and the desk you actually want to sit at.",
    images: ["/photo-hero.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b6ba0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
