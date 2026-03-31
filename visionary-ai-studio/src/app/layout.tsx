import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mo3in AI | معين — منصة الذكاء الاصطناعي العربية لصناعة المحتوى والتسويق",
  description:
    "معين هي أول منصة عربية متكاملة بالذكاء الاصطناعي لصناع المحتوى والمسوقين. أنشئ صور احترافية، فيديوهات إعلانية، مواقع إلكترونية، حملات تسويقية، محتوى UGC، وتعليقات صوتية بالعربي — كل أدوات التسويق الرقمي في مكان واحد.",
  keywords: [
    "معين",
    "Mo3in AI",
    "ذكاء اصطناعي عربي",
    "منصة ذكاء اصطناعي",
    "صناعة محتوى بالذكاء الاصطناعي",
    "تسويق رقمي",
    "تصميم بالذكاء الاصطناعي",
    "إنشاء صور AI",
    "فيديو بالذكاء الاصطناعي",
    "بناء مواقع بالذكاء الاصطناعي",
    "كتابة محتوى تسويقي",
    "UGC عربي",
    "حملات سوشيال ميديا",
    "تعليق صوتي بالعربي",
    "أدوات تسويق إلكتروني",
    "منصة صناع المحتوى",
    "AI marketing platform",
    "Arabic AI tools",
    "content creation AI",
    "social media marketing AI",
  ],
  authors: [{ name: "Mo3in AI", url: "https://mo3inai.com" }],
  creator: "Mo3in AI",
  publisher: "Mo3in AI",
  metadataBase: new URL("https://mo3inai.com"),
  alternates: {
    canonical: "https://mo3inai.com",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://mo3inai.com",
    siteName: "Mo3in AI — معين",
    title: "Mo3in AI | معين — منصة الذكاء الاصطناعي العربية لصناعة المحتوى",
    description: "أول منصة عربية متكاملة بالذكاء الاصطناعي. أنشئ صور، فيديوهات، مواقع، حملات تسويقية، ومحتوى UGC احترافي — 16 أداة ذكية في منصة واحدة.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mo3in AI | معين — منصة الذكاء الاصطناعي العربية",
    description: "أول منصة عربية متكاملة بالذكاء الاصطناعي لصناع المحتوى والمسوقين. 16 أداة ذكية في مكان واحد.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cairo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
