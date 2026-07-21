import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InventionHub — Open physical innovation",
  description: "Structure invention ideas, discover prior art, collaborate openly, and move useful hardware toward manufacturing.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
