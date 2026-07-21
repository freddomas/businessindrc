import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  CircleGauge,
  FileSearch,
  LockKeyhole,
  MapPinned,
  Radar,
  ShieldCheck
} from "lucide-react";
import { BrandLockup } from "../components/BrandLockup";
import { TrustMarquee } from "../components/TrustMarquee";
import { assurancePoints, operatingSteps, sectorGroups, sourcingStages, trustedCompanies } from "../lib/product-content";

const corridorSignals = ["Kolwezi", "Fungurume", "Likasi", "Lubumbashi", "Kasumbalesa"];

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Navigation principale">
        <BrandLockup className="brand-mark" href="#top" priority />
        <nav className="header-links" aria-label="Sections">
          <a href="#rfq">Flux RFQ</a>
          <a href="#capacites">Capacités</a>
          <a href="#qualification">Qualification</a>
          <a href="#gouvernance">Gouvernance</a>
        </nav>
        <a className="header-access" href="/connexion">
          <LockKeyhole aria-hidden="true" size={16} />
          Console privée
        </a>
      </header>

      <section id="top" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="signal-label"><span /> Sourcing industriel · Grand Katanga</p>
          <h1 id="hero-title">Un besoin critique devient une décision maîtrisée.</h1>
          <p className="hero-lede">
            Octopus Expertise cadre chaque demande, lit le terrain, vérifie les capacités locales et livre une shortlist
            défendable — avant que l&apos;urgence ne dicte le choix.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#rfq">
              Explorer le flux RFQ <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a className="secondary-action" href="/connexion">Accéder à la console</a>
          </div>
          <dl className="hero-proof" aria-label="Périmètre opérationnel">
            <div><dt>Lecture</dt><dd>5 corridors stratégiques</dd></div>
            <div><dt>Décision</dt><dd>Risque, preuve, capacité</dd></div>
            <div><dt>Suivi</dt><dd>Registre privé et traçable</dd></div>
          </dl>
        </div>

        <figure className="hero-media">
          <Image
            className="hero-image"
            src="/media/octopus-hero-v2.png"
            data-media-id="octopus-hero"
            alt="Centre de pilotage industriel surplombant une mine de cuivre au lever du jour"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 54vw"
          />
          <div className="hero-scan" aria-hidden="true" />
          <figcaption>
            <span>Signal actif</span>
            <strong>Corridor Kolwezi — Lubumbashi</strong>
            <small>Lecture terrain et capacité locale</small>
          </figcaption>
        </figure>
        <a className="scroll-cue" href="#rfq" aria-label="Découvrir le flux RFQ">
          <span>Du signal à la shortlist</span><ArrowDownRight aria-hidden="true" size={22} />
        </a>
      </section>

      <section id="rfq" className="workflow-section" aria-labelledby="rfq-title">
        <div className="section-intro split-heading">
          <div>
            <span className="section-index">RFQ / 01</span>
            <h2 id="rfq-title">Une chaîne de décision continue, pas une pile de contacts.</h2>
          </div>
          <p>Chaque étape réduit une incertitude précise. Le dossier reste lisible du premier signal jusqu&apos;à la mobilisation.</p>
        </div>
        <ol className="workflow-grid">
          {sourcingStages.map((stage, index) => (
            <li className="workflow-card" key={stage.title}>
              <span className="workflow-number">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{stage.title}</h3><p>{stage.text}</p></div>
              <span className="workflow-state">{stage.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="field-section" aria-labelledby="field-title">
        <figure className="field-media real-asset">
          <Image
            src="/media/octopus-field-operations-v2.png"
            data-media-id="octopus-field-operations"
            alt="Équipe industrielle examinant des documents de maintenance devant des engins miniers"
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
          />
          <figcaption>Évaluation terrain · pièces critiques · équipes mobiles</figcaption>
        </figure>
        <div className="field-copy">
          <Radar aria-hidden="true" size={30} />
          <h2 id="field-title">Le terrain n&apos;est pas un décor. C&apos;est la donnée qui change la décision.</h2>
          <p>
            Délais réels, couverture, HSE, disponibilité des équipes, état documentaire : la qualification assemble les
            contraintes qui déterminent si un partenaire est réellement mobilisable.
          </p>
          <div className="insight-list" aria-label="Axes de lecture">
            <span>Besoin</span><span>Zone</span><span>Risque</span><span>Preuve</span><span>Capacité</span>
          </div>
        </div>
      </section>

      <section id="capacites" className="sector-intelligence-section" aria-labelledby="sector-title">
        <div className="section-intro split-heading">
          <div>
            <span className="section-index">Réseau / 02</span>
            <h2 id="sector-title">Des capacités reliées à la contrainte qui compte.</h2>
          </div>
          <p>Une lecture resserrée par métier, zone et signal de mobilisation — sans noyer la décision dans un annuaire.</p>
        </div>
        <div className="sector-grid">
          {sectorGroups.map((group) => {
            const Icon = group.icon;
            return (
              <article className="sector-card" key={group.title}>
                <div className="sector-card-heading"><Icon aria-hidden="true" size={22} /><h3>{group.title}</h3></div>
                <p>{group.summary}</p>
                <div className="subsector-list">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
                <strong>{group.signal}</strong>
              </article>
            );
          })}
        </div>
        <div className="corridor-line" aria-label="Corridors couverts">
          {corridorSignals.map((signal) => <span key={signal}><MapPinned aria-hidden="true" size={15} />{signal}</span>)}
        </div>
      </section>

      <section id="qualification" className="qualification-section" aria-labelledby="qualification-title">
        <div className="qualification-copy">
          <span className="section-index">Méthode / 03</span>
          <h2 id="qualification-title">Une shortlist doit pouvoir expliquer chaque choix.</h2>
          <p>
            Le nom d&apos;un fournisseur ne suffit pas. Octopus Expertise relie documents, couverture, fraîcheur de
            l&apos;évaluation, ressources, niveau de risque et prochaine action terrain.
          </p>
          <a className="text-link" href="/connexion">Voir la console de qualification <ArrowRight aria-hidden="true" size={17} /></a>
        </div>
        <div className="qualification-visual" aria-label="Principes de qualification">
          <div className="decision-core"><CircleGauge aria-hidden="true" size={28} /><strong>Décision</strong><span>justifiée</span></div>
          {operatingSteps.map((step, index) => (
            <article key={step.title} style={{ "--step": index } as React.CSSProperties}>
              <span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-preview" aria-labelledby="registry-title">
        <div className="registry-preview-copy">
          <FileSearch aria-hidden="true" size={28} />
          <h2 id="registry-title">Le réseau devient lisible avant de devenir recommandable.</h2>
          <p>Les fiches rapprochent métier, ville et capacité pour accélérer l&apos;analyse avant la qualification détaillée.</p>
        </div>
        <TrustMarquee companies={trustedCompanies} />
      </section>

      <section id="gouvernance" className="assurance-section" aria-labelledby="governance-title">
        <div className="assurance-copy">
          <span className="section-index">Contrôle / 04</span>
          <h2 id="governance-title">Les données sensibles restent dans un espace de travail fermé.</h2>
          <p>
            Les sociétés, risques, évaluations et décisions sont centralisés dans la console. Les accès externes,
            paiements et intégrations restent fermés par conception pour cette version.
          </p>
          <div className="governance-proof">
            <span><ShieldCheck aria-hidden="true" size={16} />Accès privé</span>
            <span><CheckCircle2 aria-hidden="true" size={16} />Décisions tracées</span>
          </div>
        </div>
        <div className="assurance-grid">
          {assurancePoints.map((point) => {
            const Icon = point.icon;
            return <article key={point.title}><Icon aria-hidden="true" size={22} /><div><h3>{point.title}</h3><p>{point.text}</p></div></article>;
          })}
        </div>
      </section>

      <footer className="site-footer">
        <BrandLockup className="footer-brand" />
        <p>Grand Katanga · Sourcing B2B industriel · Qualification fournisseurs</p>
        <a href="mailto:contact@octopusexpertise.com">contact@octopusexpertise.com</a>
      </footer>
    </main>
  );
}
