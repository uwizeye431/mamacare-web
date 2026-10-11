import type { Metadata } from "next";

// The page is a Client Component, which can't export metadata, so it is set here.
export const metadata: Metadata = {
  title: "Symptom checker",
  description: "Describe how you feel in English or Kinyarwanda and get guidance based on WHO pregnancy danger signs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
