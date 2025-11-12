import { Shield, Clock, CheckCircle } from "lucide-react";

export default function FeatureSection() {
  return (
    <section className="py-32 px-4">
      <div className="max-w-container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 fade-in-up">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Le lien de paiement qui{" "}
              <span className="gradient-text">rassure</span>{" "}
              ton client
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Crée un lien sécurisé. Envoie-le à ton client. 
              Nous bloquons le paiement jusqu'à validation.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Paiement sécurisé via Stripe</h3>
                  <p className="text-muted-foreground">Infrastructure bancaire de niveau entreprise</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Libération automatique</h3>
                  <p className="text-muted-foreground">Après 5 jours ou validation client</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Transparence totale</h3>
                  <p className="text-muted-foreground">Suivi en temps réel pour toi et ton client</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-br from-card to-card/50 p-8 rounded-3xl border border-border shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    Payé • En attente
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary-hover w-2/3 rounded-full" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="w-8 h-8 bg-primary rounded-full mx-auto flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-muted-foreground">Créé</span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-8 h-8 bg-primary rounded-full mx-auto flex items-center justify-center animate-pulse-glow">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-primary font-medium">En cours</span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-8 h-8 bg-muted rounded-full mx-auto flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">Libéré</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Montant escrow</span>
                    <span className="text-2xl font-bold text-primary">2 500€</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-2xl opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
}