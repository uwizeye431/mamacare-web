import type { Metadata } from "next";

// The page is a Client Component, which can't export metadata, so it is set here.
export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a free MamaCare account to track your pregnancy, antenatal visits and symptoms.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
