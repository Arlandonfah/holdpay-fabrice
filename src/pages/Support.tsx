import { Navigation } from "@/components/layout/navigation";
import FooterMinimal from "@/components/landing/FooterMinimal";
import FinalCTA from "@/components/landing/FinalCTA";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/contexts/AuthContext";
import { Headphones, LifeBuoy, Mail, MessageCircle, Shield, Star, Timer } from "lucide-react";

const supportChannels = [
  {
    title: "Escalade 24/7",
    description: "Cellule d'astreinte pour vos flux critiques avec un temps de réponse garanti.",
    icon: Headphones,
    action: "Contacter l'astreinte",
    badge: "SLA 15 min",
  },
  {
    title: "Chat produit",
    description: "Parlez directement aux PM & engineers pendant vos phases de build et d'intégration.",
    icon: MessageCircle,
    action: "Ouvrir le chat",
    badge: "Temps réel",
  },
  {
    title: "Desk conformité",
    description: "Accompagnement réglementaire, templates de preuves et support audit.",
    icon: Shield,
    action: "Planifier un call",
    badge: "Experts risk",
  },
];

const knowledgeResources = [
  {
    label: "Playbooks incidents",
    detail: "Scripts et scénarios prêts à déployer pour vos équipes support.",
  },
  {
    label: "Bibliothèque API",
    detail: "Exemples live, SDKs et environnements sandbox versionnés.",
  },
  {
    label: "Centre légal",
    detail: "Contrats type, annexes compliance et matrice des responsabilités.",
  },
];

const faqs = [
  {
    question: "Comment escalader un problème critique ?",
    answer:
      "Depuis le tableau de bord, marquez un ticket comme `Incident` et choisissez le canal souhaité (Slack, mail chiffré ou ligne dédiée). Un Incident Manager prend la main en moins de 15 minutes.",
  },
  {
    question: "Proposez-vous un support multilingue ?",
    answer:
      "Oui, nos équipes couvrent français, anglais et espagnol. Des créneaux dédiés sont disponibles pour l'Amérique du Nord et l'Asie-Pacifique.",
  },
  {
    question: "Puis-je intégrer Holdpay à mon helpdesk existant ?",
    answer:
      "Nous proposons des connecteurs Zendesk, Intercom et ServiceNow. Un webhook universel vous permet d'orchestrer vos propres workflows.",
  },
];

const satisfaction = [
  { label: "CSAT moyen", value: "4,92 / 5" },
  { label: "Résolutions < 1h", value: "82 %" },
  { label: "Playbooks opérés", value: "310+" },
];

export default function Support() {
  const { isAuthenticated, userName, signOut } = useAuthContext();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation isAuthenticated={isAuthenticated} userName={userName} onLogout={signOut} />
      <main className="pt-32 pb-24">
        <section className="max-w-5xl mx-auto px-6 text-center relative">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-br from-primary/40 via-blue-500/20 to-emerald-400/30" />
          <Badge variant="secondary" className="bg-white/10 text-white/80 border-white/20 rounded-full px-4 py-2">
            Support premium
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-semibold mt-8 mb-6">
            Des experts opérationnels branchés sur vos flux.
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Que vous lanciez vos premiers comptes séquestres ou que vous opériez des millions par jour, nos équipes
            support, risk et compliance deviennent le prolongement de vos opérations.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-2xl px-8 py-6 text-base">
              Ouvrir un ticket prioritaire
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-2xl px-8 py-6 text-base border border-white/20 text-white/80"
            >
              Accéder au centre d'aide
            </Button>
          </div>
        </section>

        <section className="mt-24 max-w-6xl mx-auto px-6 grid gap-6 lg:grid-cols-3">
          {supportChannels.map(({ title, description, icon: Icon, action, badge }) => (
            <Card key={title} className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <div className="size-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs uppercase tracking-[0.4em] text-white/60">{badge}</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">{title}</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-6">{description}</p>
              <Button variant="ghost" className="px-0 text-primary hover:text-primary/80">
                {action}
              </Button>
            </Card>
          ))}
        </section>

        <section className="mt-24 max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-10 space-y-8">
            <div className="flex items-center gap-3">
              <LifeBuoy className="h-5 w-5 text-primary" />
              <span className="uppercase tracking-[0.4em] text-xs text-white/70">Knowledge center</span>
            </div>
            <h2 className="text-3xl font-semibold">Des ressources fortifiées, prêtes à être clonées.</h2>
            <p className="text-white/70">
              Reprenez nos guides opératoires, modèles de communication incident et matrices de décision. Tous les
              contenus sont versionnés et alignés sur vos environnements sandbox & production.
            </p>
            <div className="space-y-4">
              {knowledgeResources.map(({ label, detail }) => (
                <div key={label} className="p-4 rounded-2xl border border-white/10 bg-white/5">
                  <p className="text-sm text-primary mb-1">{label}</p>
                  <p className="text-base text-white/80">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="h-full rounded-3xl border border-white/10 bg-slate-950/60 p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-emerald-400" />
              <p className="text-sm text-white/70">Monitoring temps réel</p>
            </div>
            <div className="space-y-4">
              {satisfaction.map(({ label, value }) => (
                <div key={label} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{label}</p>
                  <p className="text-2xl font-semibold mt-2">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Star className="h-4 w-4 text-primary" />
              Basé sur 1200+ tickets résolus ce trimestre.
            </div>
          </div>
        </section>

        <section className="mt-24 max-w-5xl mx-auto px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
            <div className="flex items-center gap-3 mb-8">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-sm text-white/70">FAQ prioritaire</span>
            </div>
            <div className="space-y-6">
              {faqs.map(({ question, answer }) => (
                <div key={question} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-lg font-semibold mb-2">{question}</p>
                  <p className="text-white/70 text-sm leading-relaxed">{answer}</p>
                </div>
              ))}
            </div>
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


