import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grand Katanga Industrial Services Hub",
  description:
    "Plateforme B2B industrielle pour sourcing, RFQ et vérification fournisseur au Grand Katanga."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
