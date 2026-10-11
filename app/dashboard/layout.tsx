import type { Metadata } from "next";

// The page is a Client Component, which can't export metadata, so it is set here.
export const metadata: Metadata = {
  title: "My journey",
  description: "Your pregnancy dashboard.",
  robots: { index: false, follow: false }, // personal page: keep out of search engines
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
