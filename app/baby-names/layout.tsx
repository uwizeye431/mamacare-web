import type { Metadata } from "next";

// The page is a Client Component, which can't export metadata, so it is set here.
export const metadata: Metadata = {
  title: "Baby names",
  description: "Discover baby names from Kinyarwanda, African, English, French and Arabic cultures, with meanings and origins.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
