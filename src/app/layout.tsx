import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://fresco.rachkovan.com"),
  title: { default: "Fresco — Design better environments", template: "%s — Fresco" },
  description: "An open experimental community designing, testing, and improving environments for human life.",
  openGraph: { title: "Fresco", description: "Design better environments. Run experiments. Improve how we live.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}
