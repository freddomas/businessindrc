import Image from "next/image";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Factory,
  HeartPulse,
  Landmark,
  LockKeyhole,
  Network,
  RadioTower,
  Scale,
  ShieldCheck,
  Sprout,
  Wrench
} from "lucide-react";
import { OctopusScene } from "../components/OctopusScene";
import { TrustMarquee, type TrustedCompany } from "../components/TrustMarquee";

const trustedCompanies: TrustedCompany[] = [
  { mark: "LHM", name: "Lualaba Heavy Maintenance", sector: "Engins lourds" },
  { mark: "KBE", name: "Katanga Build EPC", sector: "Construction industrielle" },
  { mark: "CKS", name: "Cyber Katanga SecOps", sector: "IT & cybersécurité" },
  { mark: "CMR", name: "Copperbelt Medical Response", sector: "Support médical" },
  { mark: "LFI", name: "Lualaba Food Industries", sector: "Agro-alimentaire" },
  { mark: "TSW", name: "Tenke Structural Works", sector: "Charpente métallique" },
  { mark: "KLA", name: "Katanga Legal Advisory", sector: "Droit minier" },
  { mark: "TFW", name: "Tshamilemba Fiberworks", sector: "Télécommunications" },
  { mark: "HKA", name: "Haut-Katanga Agri Services", sector: "Agriculture" },
  { mark: "LDS", name: "Lubumbashi Datacenter Services", sector: "Continuité numérique" }
];

const sectorGroups = [
  {
    icon: Wrench,
    title: "Mines et maintenance industrielle",
    summary: "Capacités critiques pour les sites miniers, la disponibilité des engins, les convoyeurs et les pièces sensibles.",
    items: ["Maintenance engins", "Hydraulique", "Arrêts programmés", "Transit pièces critiques"],
    signal: "Priorité: continuité opérationnelle"
  },
  {
    icon: Factory,
    title: "Construction et infrastructures",
    summary: "Equipes mobilisables pour ouvrages béton, structures métalliques, bases-vie, voiries internes et lots techniques.",
    items: ["Génie civil", "Charpente", "Base-vie", "Drainage industriel"],
    signal: "Priorité: chantier maîtrisé"
  },
  {
    icon: Sprout,
    title: "Agriculture et agro-alimentaire",
    summary: "Approvisionnement local, rations industrielles, chaîne froide et contrôle qualité pour réduire la dépendance longue distance.",
    items: ["Vivrier local", "Lots secs", "Chaîne froide", "Traçabilité"],
    signal: "Priorité: sécurité d’approvisionnement"
  },
  {
    icon: RadioTower,
    title: "IT, cybersécurité et télécoms",
    summary: "Continuité numérique, connectivité site, supervision réseau et réponse incident pour environnements industriels isolés.",
    items: ["SOC managé", "Fibre optique", "Radio point à point", "Sauvegarde"],
    signal: "Priorité: résilience numérique"
  },
  {
    icon: Scale,
    title: "Juridique, finance et affaires publiques",
    summary: "Lecture réglementaire, fiscalité, contrats de sous-traitance, conformité documentaire et alignement institutionnel.",
    items: ["Droit minier", "Fiscalité", "Contrats", "Veille réglementaire"],
    signal: "Priorité: risque maîtrisé"
  },
  {
    icon: HeartPulse,
    title: "Santé, environnement et services de site",
    summary: "Support médical, évacuation, reboisement, hygiène, restauration site et suivi communautaire autour des opérations.",
    items: ["Infirmerie site", "Evacuation", "Reboisement", "Services vie site"],
    signal: "Priorité: acceptabilité terrain"
  }
];

const operatingSteps = [
  {
    title: "Lecture de la demande",
    text: "OCTOPUS Mining clarifie le besoin, la zone, la criticité, les contraintes HSE, les délais et les dépendances terrain."
  },
  {
    title: "Qualification des capacités",
    text: "Les sociétés sont analysées par documents, références, disponibilité, effectifs, certifications, couverture et niveau de risque."
  },
  {
    title: "Assemblage opérationnel",
    text: "Les compétences sont regroupées par corridor, secteur et urgence afin de constituer une réponse locale cohérente."
  },
  {
    title: "Pilotage et traçabilité",
    text: "Les décisions sensibles restent contrôlées dans une console privée avec suivi des statuts, notes et responsabilités."
  }
];

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Navigation principale">
        <a className="brand-mark" href="#top" aria-label="OCTOPUS Mining">
          <Image src="/media/octopus-logo.png" alt="Logo OCTOPUS Mining" width={230} height={72} priority unoptimized />
        </a>
        <nav className="header-links" aria-label="Sections">
          <a href="#octopus">OCTOPUS Mining</a>
          <a href="#secteurs">Secteurs</a>
          <a href="#confiance">Confiance</a>
          <a href="#gouvernance">Gouvernance</a>
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
            Un opérateur de coordination qui transforme une demande industrielle complexe en réseau local qualifié,
            mobilisable et gouverné.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#octopus">
              Comprendre le rôle
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

      <section id="octopus" className="octopus-profile-section">
        <div className="section-copy">
          <p className="eyebrow">Ce que fait OCTOPUS Mining</p>
          <h2>Un opérateur local pour structurer les capacités critiques autour des grands donneurs d’ordre.</h2>
          <p>
            OCTOPUS Mining n’agit pas comme une vitrine ouverte. L’entreprise identifie, qualifie et assemble des
            sociétés locales capables d’intervenir dans des environnements exigeants, avec une lecture claire des
            risques, des zones, des délais et des responsabilités.
          </p>
        </div>
        <div className="profile-grid">
          <article>
            <BriefcaseBusiness aria-hidden="true" size={24} />
            <h3>Qualification métier</h3>
            <p>Capacité réelle, références, documents, effectifs et disponibilité sont examinés avant mobilisation.</p>
          </article>
          <article>
            <Network aria-hidden="true" size={24} />
            <h3>Coordination par corridor</h3>
            <p>Kolwezi, Fungurume, Likasi, Lubumbashi et Kasumbalesa sont traités comme des bassins opérationnels reliés.</p>
          </article>
          <article>
            <Landmark aria-hidden="true" size={24} />
            <h3>Lecture institutionnelle</h3>
            <p>Les sujets juridiques, fiscaux, administratifs et communautaires sont intégrés dès la qualification.</p>
          </article>
        </div>
      </section>

      <section id="confiance" className="trust-section" aria-labelledby="trust-title">
        <div className="section-copy centered">
          <p className="eyebrow">Ils nous ont fait confiance</p>
          <h2 id="trust-title">Un réseau de sociétés locales mobilisées autour des besoins industriels.</h2>
          <p>
            La valeur du réseau vient de la diversité des compétences: maintenance, construction, conformité, santé,
            numérique, logistique et approvisionnement de site.
          </p>
        </div>
        <TrustMarquee companies={trustedCompanies} />
      </section>

      <section id="portefeuille" className="portfolio-section">
        <div className="section-copy">
          <p className="eyebrow">Terrain et opérations</p>
          <h2>Le besoin client n’est jamais un secteur isolé: c’est une chaîne de contraintes.</h2>
          <p>
            Une demande minière déclenche souvent de la maintenance, du génie civil, de la logistique, du juridique, de
            l’alimentation, du médical, de la cybersécurité et des télécommunications. OCTOPUS Mining relie ces pièces
            dans un même cadre de décision.
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
            src="/media/octopus-industrial-real.jpg"
            alt="Photographie réelle d’une mine à ciel ouvert avec gradins, pistes et engins industriels"
            width={1440}
            height={810}
            sizes="(max-width: 900px) 100vw, 54vw"
          />
          <figcaption>Photo: Geomartin, Wikimedia Commons, CC BY-SA 3.0. Recadrage et étalonnage appliqués.</figcaption>
        </figure>
      </section>

      <section id="secteurs" className="sector-intelligence-section" aria-labelledby="sector-title">
        <div className="section-copy centered">
          <p className="eyebrow">Secteurs et sous-secteurs</p>
          <h2 id="sector-title">Une cartographie exploitable, pas une simple liste.</h2>
          <p>
            Les familles de services sont regroupées par logique opérationnelle. La structure reste lisible même si le
            périmètre dépasse vingt secteurs ou s’étend à de nouveaux sous-secteurs.
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

      <section id="modele" className="model-section">
        <div className="section-copy centered">
          <p className="eyebrow">Modèle opéré</p>
          <h2>La valeur vient de la qualification, de l’assemblage et du contrôle.</h2>
          <p>
            La console privée sert à maintenir une donnée fiable, mais la promesse client se joue avant tout dans la
            capacité à transformer cette donnée en décision opérationnelle.
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
            Le pilotage interne centralise les sociétés, les niveaux de risque, les secteurs, les villes couvertes et
            les notes d’évaluation. Les accès externes, paiements et intégrations restent fermés par conception.
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
        <div className="footer-brand">
          <Image
            className="footer-logo"
            src="/media/octopus-logo.png"
            alt="Logo OCTOPUS Mining"
            width={156}
            height={48}
            unoptimized
          />
        </div>
        <span>Lualaba · Haut-Katanga · Coordination multisectorielle</span>
      </footer>
    </main>
  );
}
