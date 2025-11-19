import { Navigation } from "@/components/layout/navigation";
import FooterMinimal from "@/components/landing/FooterMinimal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Fingerprint,
  Layers,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const featureHighlights = [
  {
    title: "Protection intelligente",
    description:
      "Score de risque en temps réel, scénarios d'alerte et blocage proactif des anomalies grâce à nos modèles propriétaires.",
    icon: ShieldCheck,
    stats: "98,4 % des fraudes stoppées",
  },
  {
    title: "Automations financières",
    description:
      "Définissez des workflows visuels pour notifier, rembourser ou libérer les fonds selon vos propres règles métier.",
    icon: Workflow,
    stats: "27h gagnées / semaine",
  },
  {
    title: "Observabilité totale",
    description:
      "Vue à 360° sur chaque paiement, relation client enrichie et rapports prêts à être partagés avec vos parties prenantes.",
    icon: BarChart3,
    stats: "+34 % de visibilité",
  },
];

const complianceBlocks = [
  {
    title: "KYC & KYB dynamiques",
    description:
      "Des parcours vérifiés, adaptés à la juridiction de vos clients et prêts pour l'onboarding en quelques minutes.",
    icon: BadgeCheck,
  },
  {
    title: "Sécurité biométrique",
    description:
      "Authentification multifacteur, signatures numériques et empreintes biométriques à chaud pour chaque action sensible.",
    icon: Fingerprint,
  },
  {
    title: "Journal d'audit complet",
    description:
      "Toutes les interactions sont tracées et exportables pour vos équipes ops, conformité ou légales.",
    icon: Layers,
  },
];

const useCaseStories = [
  {
    title: "Marketplaces B2B",
    industry: "Escrow multi-fournisseurs",
    description:
      "Gestion des comptes tiers, libération conditionnelle et suivi des litiges pour aligner finance, juridique et opérations.",
    metricLabel: "Fonds libérés sous",
    metricValue: "6 min",
  },
  {
    title: "Proptech & immobilier",
    industry: "Séquestre locatif",
    description:
      "Vérifications KYB/KYC, sécurisation des dépôts et scénario de remboursement automatisé dès la remise des clés.",
    metricLabel: "Litiges résolus",
    metricValue: "92 %",
  },
  {
    title: "Financement participatif",
    industry: "Compliance renforcée",
    description:
      "KYC temps réel, scoring communautaire et reporting ACPR/AMF pré-formaté pour vos revues réglementaires.",
    metricLabel: "Conformité audit",
    metricValue: "100 %",
  },
];

const integrationStack = [
  { name: "Connecteurs ERP", detail: "NetSuite, Pennylane, Sellsy, SAP ByDesign" },
  { name: "Messageries internes", detail: "Slack, Teams, Mattermost + webhooks personnalisés" },
  { name: "Providers KYC", detail: "Ubble, Stripe ID, Synapse, Authenteq" },
  { name: "Data Lake & BI", detail: "Snowflake, BigQuery, AWS S3, Looker, Metabase" },
];

export default function Features() {
  const { isAuthenticated, userName, signOut } = useAuthContext();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation isAuthenticated={isAuthenticated} userName={userName} onLogout={signOut} />
      <main className="pt-32 pb-24">
        <section className="relative max-w-6xl mx-auto px-6 lg:px-10 text-center">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-br from-primary/40 via-purple-500/30 to-cyan-400/30" />
          <p className="uppercase tracking-[0.4em] text-xs text-white/70 mb-6">FONCTIONNALITÉS</p>
          <h1 className="text-4xl lg:text-6xl font-semibold leading-tight mb-6">
            Le moteur opéré pour sécuriser chaque paiement, du prototype à l'international.
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-10">
            Nous orchestrons les fonds bloqués, les vérifications réglementaires et les signaux de risques afin que vos
            équipes se concentrent sur le produit, sans compromis sur la confiance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-2xl px-8 py-6 text-base">
              Demander une démo sur mesure
            </Button>
            <Button variant="secondary" size="lg" className="rounded-2xl px-8 py-6 text-base border border-white/20">
              Explorer la documentation
            </Button>
          </div>
        </section>

        <section className="mt-20 max-w-6xl mx-auto px-6 lg:px-10 grid gap-6 md:grid-cols-3">
          {featureHighlights.map(({ title, description, icon: Icon, stats }) => (
            <Card key={title} className="bg-white/5 border-white/10 p-6 rounded-3xl backdrop-blur">
              <div className="flex items-center justify-between mb-8">
                <div className="size-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm text-white/60">{stats}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{description}</p>
            </Card>
          ))}
        </section>

        <section className="mt-24 bg-gradient-to-br from-white/5 to-white/0 border-y border-white/10">
          <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 grid gap-12 lg:grid-cols-[1.3fr_1fr] items-center">
            <div>
              <p className="text-primary font-medium mb-4">Opérations augmentées</p>
              <h2 className="text-3xl lg:text-4xl font-semibold mb-6 text-white">
                Synchronisez vos équipes produit, finance et conformité autour d'un cockpit partagé.
              </h2>
              <p className="text-white/70 mb-8">
                Des vues adaptatives pour les agents support, des exports API-ready pour la finance, des checklists
                réglementaires pour vos responsables conformité. Tirez parti de filtres avancés, de la recherche
                sémantique et d'une timeline des fonds contrôlés.
              </p>
              <div className="flex flex-wrap gap-4">
                {["Recherche sémantique", "Exports CSV + API", "Matrice des accès", "Playbooks alerting"].map(
                  (item) => (
                    <span key={item} className="px-4 py-2 rounded-full bg-white/10 text-sm text-white/80 border border-white/10">
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Temps réel</span>
                <span className="text-emerald-400 text-sm">+127 anomalies détectées</span>
              </div>
              <div className="space-y-4">
                {[42, 68, 87].map((value, idx) => (
                  <div key={value}>
                    <div className="flex justify-between text-sm text-white/70 mb-1">
                      <span>Flux #{idx + 1}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-sm text-white/70 mb-2">Règle active</p>
                <p className="text-base text-white font-medium">Libération conditionnelle après validation biométrique</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-10 mt-24">
          <div className="grid gap-6 md:grid-cols-3">
            {complianceBlocks.map(({ title, description, icon: Icon }) => (
              <div key={title} className="p-8 rounded-3xl border border-white/10 bg-white/5">
                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-10 mt-24">
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-transparent p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-10">
              <div>
                <p className="text-primary font-medium mb-2">Cas d'usage orchestrés</p>
                <h2 className="text-3xl font-semibold text-white">Des parcours prêts à être clonés.</h2>
              </div>
              <Button size="lg" variant="secondary" className="rounded-2xl border border-white/20">
                Parcourir la bibliothèque
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {useCaseStories.map(({ title, industry, description, metricLabel, metricValue }) => (
                <Card key={title} className="p-8 rounded-3xl border border-white/10 bg-white/5 space-y-4">
                  <div className="text-xs uppercase tracking-[0.4em] text-white/50">{industry}</div>
                  <h3 className="text-2xl font-semibold text-white">{title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed flex-1">{description}</p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/50">{metricLabel}</p>
                    <p className="text-2xl font-semibold text-white">{metricValue}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-10 mt-24 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="uppercase tracking-[0.4em] text-xs text-white/70">Stack intégrée</span>
            </div>
            <h2 className="text-3xl font-semibold text-white mb-4">Connexion directe à votre écosystème.</h2>
            <p className="text-white/70 mb-8">
              Configurez vos intégrations en glisser-déposer ou via notre CLI. Toutes les connexions sont monitorées et
              rejouables à chaud pour éviter les pertes d'évènements.
            </p>
            <div className="space-y-4">
              {integrationStack.map(({ name, detail }) => (
                <div key={name} className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col gap-1">
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="text-sm text-white/70">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-primary/20 via-slate-900 to-black p-10 space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-2">Score d'administration</p>
              <h3 className="text-3xl font-semibold text-white">Cockpit ops augmenté.</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Workflows actifs", value: "190+" },
                { label: "Connecteurs monitorés", value: "48" },
                { label: "Temps moyen d'audit", value: "11 min" },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-2xl bg-black/40 border border-white/10">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-1">{label}</p>
                  <p className="text-3xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-white/70">
              Logs horodatés, rejouabilité, matrice des rôles et exports prêts pour vos revues internes.
            </p>
          </div>
        </section>

        <section className="mt-24 max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-primary font-medium mb-4">Diagnostics & monitoring</p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
            Transparence totale sur vos flux financiers.
          </h2>
          <p className="text-white/70 mb-10">
            Tableaux de bord modulaires, API d’exportation temps réel, alertes intelligentes reliant vos outils internes
            (Slack, Teams, Jira).
          </p>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: "Transactions monitorées / jour", value: "2,1M" },
                { label: "Taux d'automatisation", value: "78 %" },
                { label: "SLA moyen incident", value: "14 min" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-sm uppercase tracking-widest text-white/50 mb-2">{label}</p>
                  <p className="text-3xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FooterMinimal />
    </div>
  );
}

