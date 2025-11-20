import { Navigation } from "@/components/layout/navigation";
import FinalCTA from "@/components/landing/FinalCTA";
import FooterMinimal from "@/components/landing/FooterMinimal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";
import { Check, Info, Shield } from "lucide-react";

const plans = [
  {
    name: "Launch",
    price: "0 MGA",
    frequency: "par mois",
    description: "Idéal pour valider un produit et sécuriser les premiers paiements.",
    highlights: ["Jusqu'à 50 000 € d'encours", "Workflows préconfigurés", "Support communautaire"],
    cta: "Démarrer gratuitement",
    accent: false,
  },
  {
    name: "Scale",
    price: "40.000 MGA",
    frequency: "par mois + 0,35 % / transaction",
    description: "Pour les fintechs et plateformes qui gèrent plusieurs scénarios d'escrow.",
    highlights: [
      "Encours illimité avec paliers dégressifs",
      "Playbooks et alertes personnalisés",
      "Accès prioritaire au support 24/7",
    ],
    cta: "Planifier un onboarding",
    accent: true,
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    frequency: "",
    description: "Intégrations avancées, exigences réglementaires complexes et SLA renforcé.",
    highlights: [
      "Coproduct design & sandbox dédiée",
      "Portail partenaires & multi-entités",
      "Garanties contractuelles & audit",
    ],
    cta: "Discuter avec un expert",
    accent: false,
  },
];

const assurances = [
  "Blocklist partagée entre marchands",
  "Rétention des logs sur 10 ans",
  "Mises à jour réglementaires automatisées",
  "Conformité PCI-DSS & SOC 2",
];

const serviceAddons = [
  {
    title: "Success engineer dédié",
    description: "Pilotage mensuel des KPI, calibration des règles et revues post-mortem.",
    badge: "Inclus plan Scale",
  },
  {
    title: "Escrow multi-entités",
    description: "Structurez plusieurs comptes de cantonnement avec gouvernance différenciée.",
    badge: "+ 190 MGA / entité",
  },
  {
    title: "Pack conformité avancé",
    description: "Revues réglementaires trimestrielles et assistance audit sur site.",
    badge: "Sur devis",
  },
];

const comparisonTable = [
  {
    label: "Workflows automatisés",
    launch: "3 préconfigurés",
    scale: "Illimités + builder visuel",
    enterprise: "Illimités + environments multiples",
  },
  {
    label: "Connexion API",
    launch: "Clés standard",
    scale: "OAuth + webhooks signés",
    enterprise: "VPC privé / peering",
  },
  {
    label: "Support",
    launch: "Community & email J+1",
    scale: "Prioritaire 24/7",
    enterprise: "Manager dédié",
  },
  {
    label: "Compliance",
    launch: "Rapports mensuels",
    scale: "Exports temps réel",
    enterprise: "SLA contractuel & audits",
  },
];

const pricingFaqs = [
  {
    question: "Existe-t-il des frais d'installation ?",
    answer: "Non, l'onboarding standard est inclus. Seules les intégrations spécifiques ou migrations avancées font l'objet d'un devis.",
  },
  {
    question: "Puis-je négocier les frais de transaction ?",
    answer: "Oui, des paliers dégressifs sont appliqués à partir de 5M€ d'encours mensuels. Contactez-nous pour une grille personnalisée.",
  },
  {
    question: "Comment est facturé l'escrow multi-devise ?",
    answer: "Chaque devise bénéficie d'un sous-compte cantonné. Les frais FX sont transparents et facturés au spread interbancaire + 15 pb.",
  },
];

export default function Pricing() {
  const { isAuthenticated, userName, signOut } = useAuthContext();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation isAuthenticated={isAuthenticated} userName={userName} onLogout={signOut} />
      <main className="pt-32 pb-24">
        <section className="max-w-5xl mx-auto px-6 text-center">
          <Badge variant="secondary" className="bg-white/10 text-white/80 border-white/20 rounded-full px-4 py-2">
            Transparence tarifaire & alignement sur la valeur délivrée
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-semibold mt-8 mb-6">Des plans pour chaque phase de confiance.</h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Nous tarifons sur la performance : vous payez uniquement lorsque les fonds sont protégés et que vos équipes
            gagnent en productivité. Aucune surprise, des paliers clairs et des volumes négociés à mesure que vous
            scalez.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 rounded-3xl border ${plan.accent ? "border-primary/80 bg-gradient-to-br from-primary/30 via-white/5 to-slate-900" : "border-white/10 bg-white/5"
                }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                {plan.accent && (
                  <span className="text-xs uppercase tracking-[0.2em] text-white/70">Populaire</span>
                )}
              </div>
              <p className="text-4xl font-semibold mb-2">{plan.price}</p>
              <p className="text-white/60 mb-6 text-sm">{plan.frequency}</p>
              <p className="text-white/80 text-sm leading-relaxed mb-8">{plan.description}</p>
              <div className="space-y-4 mb-10">
                {plan.highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-white/85">
                    <span className="mt-1">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </span>
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <Button
                variant={plan.accent ? "default" : "secondary"}
                className="w-full rounded-2xl py-6 text-base border border-white/10"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </section>

        <section className="max-w-6xl mx-auto px-6 mt-20 grid gap-6 md:grid-cols-3">
          {serviceAddons.map(({ title, description, badge }) => (
            <Card key={title} className="p-8 rounded-3xl border border-white/10 bg-white/5 space-y-4">
              <span className="text-xs uppercase tracking-[0.4em] text-white/60">{badge}</span>
              <h3 className="text-2xl font-semibold">{title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{description}</p>
              <Button variant="ghost" className="px-0 text-primary hover:text-primary/80">
                En savoir plus
              </Button>
            </Card>
          ))}
        </section>

        <section className="max-w-6xl mx-auto px-6 mt-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <span className="uppercase tracking-[0.4em] text-xs text-white/60">Inclus par défaut</span>
            </div>
            <h2 className="text-3xl font-semibold mb-4">Un socle de sécurité prêt pour vos auditeurs.</h2>
            <p className="text-white/70 mb-8">
              Peu importe votre plan, nous fournissons les mêmes garanties de chiffrement, de traçabilité et de support
              pour que votre équipe compliance soit convaincue dès la première démo.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {assurances.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <Check className="h-4 w-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="border border-white/10 rounded-3xl p-10 bg-gradient-to-br from-slate-900 via-slate-950 to-black space-y-6">
            <div className="flex items-center gap-3">
              <Info className="h-4 w-4 text-primary" />
              <p className="text-sm text-white/70">Pack onboarding inclus</p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Intégration technique", value: "10 jours, guidés par nos experts" },
                { label: "Formation support", value: "Playbooks + sessions live" },
                { label: "Migration des flux", value: "Audit + run parallèle" },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
                  <p className="text-base font-medium mt-2">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 mt-24 rounded-3xl border border-white/10 bg-white/5 p-8 overflow-x-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <p className="text-primary font-medium mb-2">Comparatif rapide</p>
              <h2 className="text-3xl font-semibold">Choisissez votre cadence de confiance.</h2>
            </div>
            <Button variant="secondary" className="rounded-2xl border border-white/20">
              Parler à un expert pricing
            </Button>
          </div>
          <div className="grid grid-cols-4 text-sm text-white/70 border-t border-white/10">
            <div className="py-4 font-semibold text-white">Capacité</div>
            <div className="py-4 font-semibold text-center text-white">Launch</div>
            <div className="py-4 font-semibold text-center text-white">Scale</div>
            <div className="py-4 font-semibold text-center text-white">Enterprise</div>
            {comparisonTable.map(({ label, launch, scale, enterprise }) => (
              <div key={label} className="contents border-t border-white/10">
                <div className="py-4 pr-4 text-white/80">{label}</div>
                <div className="py-4 px-4 text-center">{launch}</div>
                <div className="py-4 px-4 text-center">{scale}</div>
                <div className="py-4 px-4 text-center">{enterprise}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 mt-24">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 space-y-6">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-primary" />
              <p className="text-sm text-white/70">Questions récurrentes</p>
            </div>
            {pricingFaqs.map(({ question, answer }) => (
              <div key={question} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-lg font-semibold mb-2">{question}</p>
                <p className="text-white/70 text-sm leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 mt-24">
          <FinalCTA />
        </section>
      </main>
      <FooterMinimal />
    </div>
  );
}

