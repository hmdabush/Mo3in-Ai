import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mo3in AI — All-in-One AI Creative Studio",
  description:
    "Advanced AI platform for marketing agencies, content creators, and e-commerce managers. Automate product photography, visual storytelling, and social media campaigns.",
  keywords: [
    "Mo3in AI",
    "AI Studio",
    "Product Photography",
    "Marketing AI",
    "Social Media",
    "Content Generation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cairo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
