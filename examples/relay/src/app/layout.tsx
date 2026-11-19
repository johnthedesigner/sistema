import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Atkinson_Hyperlegible_Mono } from "next/font/google";
import "./globals.css";

// Typefaces from tokens/src/typography.json (font.sans, font.mono).
// next/font downloads them at build time and serves them from this app.
// Only the weights the type roles use are loaded.
const fontSans = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson-next",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const fontMono = Atkinson_Hyperlegible_Mono({
  variable: "--font-atkinson-mono",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Relay",
  description: "Dispatch dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
