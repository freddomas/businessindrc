import type { Metadata } from "next";
import { InteractiveBackdrop } from "../components/InteractiveBackdrop";
import "./globals.css";

export const metadata: Metadata = {
  title: "OCTOPUS Mining Industrial Services Hub",
  description:
    "Plateforme B2B pour qualifier des prestataires et structurer des offres de services dans le Haut-Katanga et le Lualaba."
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
