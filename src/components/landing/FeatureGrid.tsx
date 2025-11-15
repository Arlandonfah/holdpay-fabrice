import { Shield, Heart, Lock, Clock, Sparkles } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Pas de litige",
    description: "Processus transparent qui évite 99% des conflits de paiement",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-500/10 to-blue-600/5",
    stat: "99%"
  },
  {
    icon: Heart,
    title: "Confiance immédiate",
    description: "Tes clients voient que tu es un pro qui utilise les bons outils",
    color: "from-red-500 to-red-600",
    bgColor: "from-red-500/10 to-red-600/5",
    stat: "5★"
  },
  {
    icon: Lock,
    title: "Paiement bloqué = client rassuré",
    description: "Ton client sait que son argent est en sécurité jusqu'à la livraison",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-500/10 to-green-600/5",
    stat: "100%"
  },
  {
    icon: Clock,
    title: "Libération automatique après 5 jours",
    description: "Même si ton client ne valide pas, tu es payé automatiquement",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-500/10 to-purple-600/5",
    stat: "5j"
  }
];

export default function FeatureGrid() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-accent/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Avantages
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground px-4">
            Pourquoi{" "}
            <span className="text-primary font-semibold">Holdpay</span>{" "}
            ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            La solution de paiement sécurisé qui transforme tes relations clients
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card */}
              <div className={`relative h-full p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br ${feature.bgColor} border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}>
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`inline-flex p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  {/* Stat Badge */}
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {feature.stat}
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
              </div>

              {/* Background Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-br ${feature.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-sm sm:text-base text-muted-foreground">
            Rejoins des centaines de freelances qui font confiance à Holdpay
          </p>
        </div>
      </div>
    </section>
  );
}