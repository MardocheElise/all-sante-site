import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "All_Santé — Plateforme d'interopérabilité FHIR",
    template: "%s · All_Santé",
  },
  description:
    "All_Santé est le middleware d'interopérabilité FHIR qui unifie les logiciels hospitaliers (SGCH, DPI, OpenELIS) autour du matricule CMU et les raccorde au dépôt national de santé.",
  keywords: ["FHIR", "interopérabilité", "santé", "DPI", "SGCH", "OpenELIS", "middleware", "API", "CMU"],
  authors: [{ name: "KRA Mardochée" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
