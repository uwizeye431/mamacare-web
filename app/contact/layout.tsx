import type { Metadata } from "next";

// The page is a Client Component, which can't export metadata, so it is set here.
export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the MamaCare team by message, email or phone.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
