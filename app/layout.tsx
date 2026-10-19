import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innovator — Invention Generation Studio",
  description: "Generate and structure invention candidates from your own problem specification, with explicit evidence gaps and validation questions.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
