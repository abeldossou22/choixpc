import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChoixPC — Trouvez l'ordinateur parfait avec l'IA",
  description: "ChoixPC analyse vos besoins, votre budget et vous conseille le meilleur ordinateur — gratuitement, en 2 minutes, sans jargon technique.",
  keywords: ["ordinateur", "conseil IA", "achat PC", "Bénin", "FCFA", "ChoixPC", "HevelCare"],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased" style={{ background: "var(--bg)", color: "var(--text)" }}>{children}</body>
    </html>
  );
}
