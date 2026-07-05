import Link from "next/link";
import { BriefcaseBusiness, Gauge, MapPinned, Network, Pickaxe, ShieldCheck } from "lucide-react";

const links = [
  { href: "/fournisseurs", label: "Prestataires", icon: Network },
  { href: "/opportunites", label: "Offres", icon: BriefcaseBusiness },
  { href: "/zones/kolwezi", label: "Zones", icon: MapPinned },
  { href: "/console", label: "Console", icon: Gauge }
];

export function TopNav() {
  return (
    <header className="top-nav">
      <Link className="brand" href="/" aria-label="Accueil OCTOPUS Mining Industrial Services Hub">
        <span className="brand-mark" aria-hidden="true">
          <Pickaxe size={21} />
        </span>
        <span>
          <strong>OCTOPUS Mining</strong>
          <small>Industrial Services Hub</small>
        </span>
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
      <div className="nav-signal" aria-label="Statut de qualification">
        <ShieldCheck aria-hidden="true" size={16} />
        <span>Qualifié</span>
      </div>
    </header>
  );
}
