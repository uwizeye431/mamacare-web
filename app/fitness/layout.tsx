import type { Metadata } from "next";

// The page is a Client Component, which can't export metadata, so it is set here.
export const metadata: Metadata = {
  title: "Pregnancy fitness",
  description: "Pregnancy-safe workouts, postpartum recovery routines and weekly movement plans.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
