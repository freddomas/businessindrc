import type { Metadata } from "next";
import "./globals.css";
import { BRAND } from "../lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: { default: `${BRAND.name} | Sourcing industriel Grand Katanga`, template: `%s | ${BRAND.name}` },
  description: BRAND.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CD",
    url: BRAND.url,
    siteName: BRAND.name,
    title: `${BRAND.name} | Sourcing industriel Grand Katanga`,
    description: BRAND.description,
    images: [{ url: "/media/octopus-hero-v2.png", width: 1672, height: 941, alt: "Pilotage du sourcing industriel dans le Grand Katanga" }]
  },
  twitter: { card: "summary_large_image", title: BRAND.name, description: BRAND.description, images: ["/media/octopus-hero-v2.png"] },
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
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: BRAND.name,
              url: BRAND.url,
              description: BRAND.description,
              areaServed: ["Lualaba", "Haut-Katanga"]
            }).replace(/</g, "\\u003c")
          }}
        />
      </body>
    </html>
  );
}
