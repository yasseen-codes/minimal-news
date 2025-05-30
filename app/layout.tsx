import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/types/hn";

// Importing the Vercel Analytics and Speed Insights components
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "sonner";

const InterSans = localFont({
  src: "../public/fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-sans",
  display: "swap",
});
const LibreBaskervilleSerif = localFont({
  src: "../public/fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf",
  variable: "--font-serif",
  display: "swap",
});

const IBMPlexMono = localFont({
  src: "../public/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // Primary title for the site.
  // Using an object allows setting a default and a template for dynamic titles.
  title: {
    default: "Minimal News", // Default title for pages that don't specify one
    template: "%s | Minimal News", // Template for pages that do specify a title (%s is replaced by the page title)
  },
  // Short description of your website. Appears in search results.
  description:
    "A minimal, fast, and eye-relaxed Hacker News reader built with Next.js and Tailwind CSS.",
  // Keywords relevant to your website's content.
  keywords: [
    "Hacker News",
    "HN",
    "news reader",
    "tech news",
    "programming news",
    "minimal",
    "minimalist",
    "eye-relaxed theme",
    "hcker news",
    "hackernews",
    "minimal news",
    "minimal-news",
  ],
  // Information about the author(s).
  authors: [
    {
      name: "Yasseen Abo Rasheed",
      url: "https://linkedin.com/in/yasseen-aborasheed-11592a236",
    },
  ],
  // Information about the creator (often the same as author).
  creator: "Yasseen Abo Rasheed",
  // Information about the publisher.
  publisher: "Yasseen Abo Rasheed",

  // --- Optional but Recommended Meta Tags ---

  // Canonical URL for the homepage (helps prevent duplicate content issues)
  metadataBase: new URL(SITE_URL),

  // Open Graph tags for social media sharing previews
  openGraph: {
    title: "Minimal News",
    description:
      "A minimal, fast, and eye-relaxed Hacker News reader built with Next.js and Tailwind CSS.",
    url: SITE_URL,
    siteName: "Minimal News",
    images: [
      // Add a default image for social previews (e.g., your logo)
      {
        url: `${SITE_URL}/minimal-news-logo.png`,
        width: 1200,
        height: 630,
        alt: "Minimal News Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card tags for Twitter sharing previews
  twitter: {
    card: "summary",
    title: "Minimal News",
    description:
      "A minimal, fast, and eye-relaxed Hacker News reader built with Next.js and Tailwind CSS.",

    images: [`${SITE_URL}/minimal-news-logo.png`],
  },

  verification: {
    google: "FSiaE7Cy_Xz2BIOyDvxEWsrYlEfNaMMLspKbN6pSLE4",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  themeColor: "#cecece",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${InterSans.variable} ${LibreBaskervilleSerif.variable} ${IBMPlexMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
