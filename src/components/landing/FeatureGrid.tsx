import { Shield, Heart, Lock, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Pas de litige",
    description: "Processus transparent qui évite 99% des conflits de paiement",
    color: "from-blue-500/20 to-blue-600/10"
  },
  {
    icon: Heart,
    title: "Confiance immédiate",
    description: "Tes clients voient que tu es un pro qui utilise les bons outils",
    color: "from-red-500/20 to-red-600/10"
  },
  {
    icon: Lock,
    title: "Paiement bloqué = client rassuré",
    description: "Ton client sait que son argent est en sécurité jusqu'à la livraison",
    color: "from-green-500/20 to-green-600/10"
  },
  {
    icon: Clock,
    title: "Libération automatique après 5 jours",
    description: "Même si ton client ne valide pas, tu es payé automatiquement",
    color: "from-purple-500/20 to-purple-600/10"
  }
];

export default function FeatureGrid() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 px-6">
      <div className="max-w-container mx-auto">
        <div className="text-center mb-20 sm:mb-24 lg:mb-32">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-8 text-foreground">
            Pourquoi{" "}
            <span className="text-primary font-medium">Holdpay</span>{" "}
            ?
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-light px-4">
            La solution de paiement sécurisé qui transforme tes relations clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 sm:p-12 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:shadow-2xl transition-all duration-300"
            >
              <div className="space-y-6 sm:space-y-8">
                <div className="relative">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl w-fit border border-white/30">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-medium text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}