import Link from "next/link";
import { Building2, Factory, FileText, Gauge, MapPinned } from "lucide-react";

const links = [
  { href: "/fournisseurs", label: "Fournisseurs", icon: Factory },
  { href: "/opportunites", label: "Opportunités", icon: FileText },
  { href: "/zones/kolwezi", label: "Zones", icon: MapPinned },
  { href: "/console", label: "Console", icon: Gauge }
];

export function TopNav() {
  return (
    <header className="top-nav">
      <Link className="brand" href="/" aria-label="Accueil Grand Katanga Industrial Services Hub">
        <Building2 aria-hidden="true" size={24} />
        <span>Grand Katanga Industrial Services Hub</span>
      </Link>
      <nav aria-label="Navigation principale">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link href={link.href} key={link.href}>
              <Icon aria-hidden="true" size={17} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
