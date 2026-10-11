import type { Metadata } from "next";

// The page is a Client Component, which can't export metadata, so it is set here.
export const metadata: Metadata = {
  title: "Reset your password",
  description: "Reset the password for your MamaCare account.",
  robots: { index: false, follow: false }, // personal page: keep out of search engines
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
