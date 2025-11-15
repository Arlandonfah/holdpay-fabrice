import { Link, CreditCard, FileCheck, Banknote, ArrowRight, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Link,
    title: "Crée ton lien",
    description: "Configure montant et projet en 30 secondes",
    color: "from-blue-500 to-blue-600",
    time: "30 sec"
  },
  {
    icon: CreditCard,
    title: "Ton client paie en sécurité",
    description: "Paiement instantané via Stripe, fonds bloqués",
    color: "from-green-500 to-green-600",
    time: "Instant"
  },
  {
    icon: FileCheck,
    title: "Tu livres ton projet",
    description: "Marque ta mission comme livrée",
    color: "from-purple-500 to-purple-600",
    time: "Variable"
  },
  {
    icon: Banknote,
    title: "Les fonds sont libérés",
    description: "Automatique après validation ou 5 jours",
    color: "from-orange-500 to-orange-600",
    time: "5 jours max"
  }
];

export default function TimelineSteps() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-accent/5 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground px-4">
            Comment{" "}
            <span className="text-primary font-semibold">ça fonctionne</span>{" "}
            ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Un processus simple en 4 étapes pour sécuriser tes paiements freelance
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="hidden lg:block absolute top-24 left-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full" style={{ width: '75%' }} />
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Card */}
                <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 hover:bg-card hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-lg z-10">
                    {index + 1}
                  </div>
                  
                  {/* Icon Container */}
                  <div className="relative mb-6 pt-2">
                    <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${step.color} shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Time Badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background border border-border px-3 py-1 rounded-full text-xs font-semibold text-primary whitespace-nowrap">
                      {step.time}
                    </div>
                    
                    {/* Glow Effect */}
                    <div className={`absolute -inset-2 bg-gradient-to-br ${step.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10`} />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3 text-center pt-4">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Arrow between steps - Desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-24 -right-4 items-center justify-center z-20">
                    <div className="bg-background border-2 border-primary rounded-full p-2 shadow-lg">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Info */}
        <div className="text-center mt-12 sm:mt-16 px-4">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full text-primary text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Processus 100% automatisé et sécurisé
          </div>
        </div>
      </div>
    </section>
  );
}