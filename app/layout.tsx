import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OCTOPUS Mining",
  description:
    "Plateforme privée de qualification et de pilotage des partenaires industriels OCTOPUS Mining dans le Lualaba et le Haut-Katanga.",
  icons: {
    icon: "/icon.svg"
  }
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
