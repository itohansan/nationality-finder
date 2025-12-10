import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: "Artist Nationality Finder – Discover Where Artists Are From",
  description:
    "Search any artist, musician, or celebrity and instantly find their nationality along with key profile details. Simple, fast, and accurate artist lookup.",
  keywords: [
    "artist nationality",
    "celebrity nationality",
    "where is this artist from",
    "musician nationality finder",
    "artist lookup",
    "celebrity search",
    "nationality search tool",
  ],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Artist Nationality Finder",
    description:
      "Find the nationality and background details of any artist or celebrity.",
    type: "website",
    siteName: "Artist Nationality Finder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artist Nationality Finder",
    description:
      "Instantly discover the nationality of artists, musicians, and celebrities.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
