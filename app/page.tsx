import Image from "next/image";
import { ArrowRight, Building2, CheckCircle2, Factory, LockKeyhole, Network, ShieldCheck } from "lucide-react";
import { OctopusScene } from "../components/OctopusScene";
import { getSeedStats, sectors } from "../lib/seed-data";

const operatingSteps = [
  "Cartographier les besoins industriels",
  "Qualifier les capacités locales",
  "Assembler les équipes par zone",
  "Piloter les engagements sensibles"
];

const strategicSectors = [
  "Avocats",
  "Comptabilité",
  "Lobbying",
  "Mines",
  "Agriculture",
  "Secteur forestier",
  "Experts IT & cybersécurité",
  "Télécommunications",
  "Agro-alimentaire",
  "Support médical",
  "Construction"
];

export default function HomePage() {
  const stats = getSeedStats();

  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Navigation principale">
        <a className="brand-mark" href="#top" aria-label="OCTOPUS Mining">
          <Image src="/media/octopus-logo.png" alt="Logo OCTOPUS Mining" width={178} height={72} priority />
        </a>
        <nav className="header-links" aria-label="Sections">
          <a href="#portefeuille">Portefeuille</a>
          <a href="#modele">Modèle opéré</a>
          <a href="#verification">Vérification</a>
        </nav>
        <a className="header-access" href="/connexion">
          <LockKeyhole aria-hidden="true" size={17} />
          Console privée
        </a>
      </header>

      <section id="top" className="hero-section" aria-labelledby="hero-title">
        <Image
          className="hero-image"
          src="/media/octopus-hero.png"
          alt="Salle de pilotage industrielle surplombant un site minier au lever du jour"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">Lualaba · Haut-Katanga · Coordination multisectorielle</p>
          <h1 id="hero-title">OCTOPUS Mining</h1>
          <p className="hero-lede">
            Un opérateur économique structurant pour qualifier, assembler et piloter les partenaires critiques autour
            des besoins industriels les plus exigeants.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#modele">
              Voir le modèle
              <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a className="secondary-action" href="/connexion">
              Accès contrôlé
            </a>
          </div>
        </div>
        <div className="hero-scene-panel" aria-hidden="true">
          <OctopusScene />
        </div>
      </section>

      <section className="metrics-band" aria-label="Indicateurs de qualification">
        <div>
          <strong>{stats.total}</strong>
          <span>partenaires suivis</span>
        </div>
        <div>
          <strong>{stats.qualified}</strong>
          <span>dossiers qualifiés</span>
        </div>
        <div>
          <strong>{stats.sectors}</strong>
          <span>secteurs couverts</span>
        </div>
        <div>
          <strong>{stats.averageReadiness}%</strong>
          <span>score moyen</span>
        </div>
      </section>

      <section id="portefeuille" className="portfolio-section">
        <div className="section-copy">
          <p className="eyebrow">Portefeuille multisectoriel</p>
          <h2>Un réseau piloté pour les opérations à haute exigence.</h2>
          <p>
            OCTOPUS Mining articule des expertises juridiques, financières, techniques, sanitaires et numériques pour
            soutenir les chaînes de valeur industrielles dans les deux provinces.
          </p>
        </div>
        <div className="portfolio-image-wrap">
          <Image
            src="/media/octopus-portfolio.png"
            alt="Table de coordination regroupant des secteurs industriels et services stratégiques"
            width={1440}
            height={810}
            sizes="(max-width: 900px) 100vw, 54vw"
          />
        </div>
      </section>

      <section className="sector-band" aria-label="Secteurs couverts">
        {strategicSectors.map((sector) => (
          <span key={sector}>{sector}</span>
        ))}
      </section>

      <section id="modele" className="model-section">
        <div className="section-copy centered">
          <p className="eyebrow">Modèle opéré</p>
          <h2>La valeur vient de la qualification, pas d’une vitrine ouverte.</h2>
          <p>
            Chaque partenaire est évalué par capacité réelle, zone de couverture, niveau de risque, disponibilité et
            qualité documentaire avant d’être mobilisé.
          </p>
        </div>
        <div className="process-grid">
          {operatingSteps.map((step, index) => (
            <article className="process-item" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step}</h3>
              <p>
                Décision appuyée par des données de terrain, une revue documentaire et une lecture claire des
                contraintes locales.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="verification" className="assurance-section">
        <div className="assurance-copy">
          <p className="eyebrow">Gouvernance et confiance</p>
          <h2>Une console privée pour garder le contrôle sur les données sensibles.</h2>
          <p>
            Le pilotage interne centralise les partenaires, les niveaux de risque, les secteurs, les villes couvertes
            et les notes d’évaluation. Les accès externes, paiements et intégrations restent fermés par conception.
          </p>
        </div>
        <div className="assurance-grid">
          <div>
            <ShieldCheck aria-hidden="true" size={24} />
            <h3>Qualification</h3>
            <p>Statuts, risques, scores et pièces de contrôle réunis dans une même lecture opérationnelle.</p>
          </div>
          <div>
            <Network aria-hidden="true" size={24} />
            <h3>Couverture</h3>
            <p>Kolwezi, Lubumbashi, Likasi, Fungurume, Kasumbalesa et zones industrielles adjacentes.</p>
          </div>
          <div>
            <Factory aria-hidden="true" size={24} />
            <h3>Capacité</h3>
            <p>Effectifs, services, certifications et disponibilité vérifiables avant mobilisation.</p>
          </div>
          <div>
            <CheckCircle2 aria-hidden="true" size={24} />
            <h3>Contrôle</h3>
            <p>Registre privé, actions tracées et accès limités aux équipes autorisées.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <Building2 aria-hidden="true" size={18} />
          OCTOPUS Mining
        </div>
        <span>{sectors.length} secteurs suivis dans le registre privé.</span>
      </footer>
    </main>
  );
}
