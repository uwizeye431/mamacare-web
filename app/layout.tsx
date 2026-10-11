import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SITE_NAME, SITE_URL } from "../lib/site";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

const DESCRIPTION =
  "Maternal health support for mothers in Rwanda: prenatal care guides, a symptom checker based on WHO danger signs that understands English and Kinyarwanda, breastfeeding help and postpartum support.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Pages set a short title; " | MamaCare" is added automatically
  title: {
    default: "MamaCare - Nurturing Maternal Health",
    template: "%s | MamaCare",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "MamaCare - Nurturing Maternal Health",
    description: DESCRIPTION,
    locale: "en_RW",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {/* Global persistent Navbar - always visible on every page */}
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
