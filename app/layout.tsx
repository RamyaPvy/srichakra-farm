import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { LanguageProvider } from "./providers/LanguageProvider";

export const metadata: Metadata = {
  title: "SriChakra Farm",
  description: "Fresh Fish • Vegetables • Mutton • Raw Rice",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <LanguageProvider>
          <Header />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}