import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innovator — Research studio for useful invention",
  description: "Link knowledge across disciplines, challenge invention candidates, and move useful ideas toward decisive tests.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
