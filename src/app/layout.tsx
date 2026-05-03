import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Agent Hub",
  description: "AI Agent Management Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={geist.variable}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex">
        <Sidebar />
        <main className="flex-1 ml-56 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
