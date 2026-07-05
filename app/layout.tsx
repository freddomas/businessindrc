import type { Metadata } from "next";
import { InteractiveBackdrop } from "../components/InteractiveBackdrop";
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
      <body>
        <InteractiveBackdrop />
        {children}
      </body>
    </html>
  );
}
