import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GulfFreelance", template: "%s | GulfFreelance" },
  description: "Gulf-focused jobs and freelance marketplace for Arabic and English speakers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
