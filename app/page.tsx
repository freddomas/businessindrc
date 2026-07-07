import Image from "next/image";
import { ArrowRight, CheckCircle2, LockKeyhole, MapPinned, ShieldCheck } from "lucide-react";
import { TrustMarquee } from "../components/TrustMarquee";
import {
  assurancePoints,
  operatingSteps,
  profilePoints,
  sectorGroups,
  sourcingStages,
  trustedCompanies
} from "../lib/product-content";

const corridorSignals = ["Kolwezi", "Fungurume", "Likasi", "Lubumbashi", "Kasumbalesa"];

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Navigation principale">
        <a className="brand-mark" href="#top" aria-label="OCTOPUS Mining">
          <Image src="/media/octopus-logo.png" alt="Logo OCTOPUS Mining" width={230} height={72} priority unoptimized />
        </a>
        <nav className="header-links" aria-label="Sections">
          <a href="#rfq">Flux RFQ</a>
          <a href="#capacites">Capacités</a>
          <a href="#qualification">Qualification</a>
          <a href="#gouvernance">Gouvernance</a>
        </nav>
        <a className="header-access" href="/connexion">
          <LockKeyhole aria-hidden="true" size={17} />
          Accès privé
        </a>
      </header>

      <section id="top" className="hero-section" aria-labelledby="hero-title">
        <Image
          className="hero-image"
          src="/media/octopus-hero-v2.png"
          alt="Centre de pilotage industriel surplombant une mine de cuivre au lever du jour"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">Sourcing B2B industriel - Grand Katanga</p>
            <h1 id="hero-title">Qualifier un besoin industriel. Mobiliser le bon partenaire local.</h1>
            <p className="hero-lede">
              OCTOPUS Mining transforme une demande critique en flux RFQ contrôlé: cadrage du besoin, lecture
              des risques, vérification partenaire, shortlist opérationnelle et suivi privé des décisions sensibles.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#rfq">
                Cadrer un flux RFQ
                <ArrowRight aria-hidden="true" size={18} />
              </a>
              <a className="secondary-action" href="/connexion">
                Ouvrir la console
              </a>
            </div>
          </div>

          <aside className="hero-ops" aria-label="Synthèse opérationnelle">
            <div>
              <span>Lecture terrain</span>
              <strong>5 corridors actifs</strong>
            </div>
            <div>
              <span>Qualification</span>
              <strong>Statut, risque, capacité</strong>
            </div>
            <div>
              <span>Decision</span>
              <strong>Shortlist suivie en console</strong>
            </div>
          </aside>
        </div>
      </section>

      <section id="rfq" className="workflow-section" aria-labelledby="rfq-title">
        <div className="section-copy centered">
          <p className="eyebrow">Flux RFQ contrôlé</p>
          <h2 id="rfq-title">Du besoin industriel au partenaire mobilisable, sans lecture dispersée.</h2>
          <p>
            Le flux garde chaque demande dans une séquence simple: cadrer, comparer, vérifier, puis suivre la
            mobilisation dans la console privée.
          </p>
        </div>
        <div className="workflow-grid">
          {sourcingStages.map((stage) => (
            <article className="workflow-card" key={stage.title}>
              <span>{stage.label}</span>
              <h3>{stage.title}</h3>
              <p>{stage.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="octopus" className="octopus-profile-section">
        <div className="section-copy">
          <p className="eyebrow">Rôle OCTOPUS Mining</p>
          <h2>Un opérateur local pour transformer les capacités dispersées en décisions exploitables.</h2>
          <p>
            OCTOPUS Mining identifie, qualifie et assemble des sociétés locales capables d&apos;intervenir dans des
            environnements exigeants, avec une lecture claire des risques, des zones, des délais et des
            responsabilités.
          </p>
        </div>
        <div className="profile-grid">
          {profilePoints.map((point) => {
            const Icon = point.icon;
            return (
              <article key={point.title}>
                <Icon aria-hidden="true" size={24} />
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="confiance" className="trust-section" aria-labelledby="trust-title">
        <div className="section-copy centered">
          <p className="eyebrow">Registre qualifié</p>
          <h2 id="trust-title">Des sociétés lisibles par métier, ville et niveau de mobilisation.</h2>
          <p>
            Chaque entrée expose le nom complet, le domaine et la zone utile pour accélérer la lecture
            opérationnelle avant qualification détaillée.
          </p>
        </div>
        <TrustMarquee companies={trustedCompanies} />
      </section>

      <section id="terrain" className="portfolio-section">
        <div className="section-copy">
          <p className="eyebrow">Terrain et opérations</p>
          <h2>Un besoin client n&apos;est jamais un secteur isolé: c&apos;est une chaîne de contraintes.</h2>
          <p>
            Une demande minière déclenche souvent maintenance, génie civil, logistique, juridique, alimentation,
            médical, cybersécurité et télécommunications. La plateforme relie ces pièces dans un même cadre de
            décision.
          </p>
          <div className="insight-list">
            <span>Besoin industriel</span>
            <span>Risque local</span>
            <span>Capacité vérifiable</span>
            <span>Mobilisation coordonnée</span>
          </div>
        </div>
        <figure className="portfolio-image-wrap real-asset">
          <Image
            src="/media/octopus-field-operations-v2.png"
            alt="Equipe industrielle examinant des documents de maintenance devant des engins miniers"
            width={1440}
            height={810}
            sizes="(max-width: 900px) 100vw, 54vw"
          />
          <figcaption>Contrôle terrain, pièces critiques, équipes mobiles et décision de mobilisation.</figcaption>
        </figure>
      </section>

      <section className="rfq-intelligence-section" aria-labelledby="rfq-intelligence-title">
        <figure className="rfq-image-wrap real-asset">
          <Image
            src="/media/octopus-rfq-operations-v1.png"
            alt="Salle opérations industrielles avec cartes de corridor et dossiers RFQ"
            width={1536}
            height={864}
            sizes="(max-width: 980px) 100vw, 50vw"
          />
        </figure>
        <div className="section-copy">
          <p className="eyebrow">Shortlist opérationnelle</p>
          <h2 id="rfq-intelligence-title">Chaque recommandation doit expliquer son corridor, son risque et sa capacité.</h2>
          <p>
            La lecture ne s&apos;arrête pas au nom d&apos;un fournisseur: elle relie documents, couverture, fraîcheur
            d&apos;évaluation, ressources et prochaine action de terrain.
          </p>
          <div className="corridor-row" aria-label="Corridors couverts">
            {corridorSignals.map((signal) => (
              <span key={signal}>
                <MapPinned aria-hidden="true" size={15} />
                {signal}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="capacites" className="sector-intelligence-section" aria-labelledby="sector-title">
        <div className="section-copy centered">
          <p className="eyebrow">Capacités industrielles</p>
          <h2 id="sector-title">Une lecture par secteur, contrainte et signal de mobilisation.</h2>
          <p>
            Les familles de services restent lisibles pour relier vite un besoin à une capacité locale contrôlable.
          </p>
        </div>
        <div className="sector-grid">
          {sectorGroups.map((group) => {
            const Icon = group.icon;
            return (
              <article className="sector-card" key={group.title}>
                <div className="sector-card-heading">
                  <Icon aria-hidden="true" size={24} />
                  <h3>{group.title}</h3>
                </div>
                <p>{group.summary}</p>
                <div className="subsector-list">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <strong>{group.signal}</strong>
              </article>
            );
          })}
        </div>
      </section>

      <section id="qualification" className="model-section">
        <div className="section-copy centered">
          <p className="eyebrow">Qualification contrôlée</p>
          <h2>La valeur vient de la qualification, de l&apos;assemblage et du suivi privé.</h2>
          <p>
            La console maintient une donnée fiable, mais la promesse client se joue dans la capacité à transformer
            cette donnée en décision opérationnelle.
          </p>
        </div>
        <div className="process-grid">
          {operatingSteps.map((step, index) => (
            <article className="process-item" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="gouvernance" className="assurance-section">
        <div className="assurance-copy">
          <p className="eyebrow">Gouvernance et confiance</p>
          <h2>Une interface privée pour garder le contrôle sur les données sensibles.</h2>
          <p>
            Le pilotage interne centralise les sociétés, les niveaux de risque, les secteurs, les villes couvertes
            et les notes d&apos;évaluation. Les accès externes, paiements et intégrations restent fermés par conception.
          </p>
        </div>
        <div className="assurance-grid">
          {assurancePoints.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title}>
                <Icon aria-hidden="true" size={24} />
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            );
          })}
        </div>
        <div className="governance-proof" aria-label="Garde-fous V1">
          <span>
            <ShieldCheck aria-hidden="true" size={16} />
            Accès privé
          </span>
          <span>
            <CheckCircle2 aria-hidden="true" size={16} />
            Décisions tracées
          </span>
          <span>
            <CheckCircle2 aria-hidden="true" size={16} />
            Intégrations fermées
          </span>
        </div>
      </section>

      <footer className="site-footer">
        <strong>OCTOPUS Mining</strong>
        <span>Lualaba - Haut-Katanga - Sourcing industriel contrôlé</span>
      </footer>
    </main>
  );
}
