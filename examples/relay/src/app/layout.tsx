import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import "./globals.css";

// Typeface from tokens/src/typography.json (font.sans).
// next/font downloads them at build time and serves them from this app.
// Only the weights the type roles use are loaded.
const fontSans = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson-next",
  weight: ["400", "500", "600"],
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
        className={`${fontSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
