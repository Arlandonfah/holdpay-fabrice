import { Link, CreditCard, FileCheck, Banknote } from "lucide-react";

const steps = [
  {
    icon: Link,
    title: "Crée ton lien",
    description: "Configure montant et projet en 30 secondes",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: CreditCard,
    title: "Ton client paie en sécurité",
    description: "Paiement instantané via Stripe, fonds bloqués",
    color: "from-green-500 to-green-600"
  },
  {
    icon: FileCheck,
    title: "Tu livres ton projet",
    description: "Marque ta mission comme livrée",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Banknote,
    title: "Les fonds sont libérés",
    description: "Automatique après validation ou 5 jours",
    color: "from-orange-500 to-orange-600"
  }
];

export default function TimelineSteps() {
  return (
    <section className="py-32 px-4">
      <div className="max-w-container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Comment{" "}
            <span className="gradient-text">ça fonctionne</span>{" "}
            ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un processus simple en 4 étapes pour sécuriser tes paiements freelance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative group text-center fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative">
                {/* Icon Container */}
                <div className={`bg-gradient-to-br ${step.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                
                {/* Step Number */}
                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                
                {/* Glow Effect */}
                <div className={`absolute -inset-2 bg-gradient-to-br ${step.color} rounded-2xl blur opacity-25 group-hover:opacity-75 transition-opacity duration-300 -z-10`} />
              </div>
              
              <div className="mt-6 space-y-3">
                <h3 className="font-bold text-xl">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}