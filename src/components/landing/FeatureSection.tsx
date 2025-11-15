import { Shield, Clock, CheckCircle, TrendingUp, Zap } from "lucide-react";

export default function FeatureSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-2">
              <Zap className="h-4 w-4" />
              Comment ça marche
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-foreground">
              Le lien de paiement qui{" "}
              <span className="text-primary font-semibold">rassure</span>{" "}
              ton client
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              Crée un lien sécurisé. Envoie-le à ton client. 
              Nous bloquons le paiement jusqu'à validation.
            </p>
            
            <div className="space-y-4 sm:space-y-5 pt-4">
              <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-card/50 transition-all duration-300 border border-transparent hover:border-primary/20">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 text-foreground">Paiement sécurisé via Stripe</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Infrastructure bancaire de niveau entreprise</p>
                </div>
              </div>
              
              <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-card/50 transition-all duration-300 border border-transparent hover:border-primary/20">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 text-foreground">Libération automatique</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Après 5 jours ou validation client</p>
                </div>
              </div>
              
              <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-card/50 transition-all duration-300 border border-transparent hover:border-primary/20">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 text-foreground">Transparence totale</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Suivi en temps réel pour toi et ton client</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:order-2">
            <div className="relative group">
              <div className="bg-gradient-to-br from-card to-card/50 p-6 sm:p-8 rounded-3xl border border-border shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                <div className="space-y-5 sm:space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-muted-foreground font-medium">Status du paiement</span>
                    <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                      Payé • En attente
                    </span>
                  </div>
                  
                  {/* Progress */}
                  <div className="space-y-4">
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-pulse"></div>
                      <div className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full transition-all duration-1000 w-2/3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    
                    {/* Steps */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center pt-2">
                      <div className="space-y-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full mx-auto flex items-center justify-center shadow-lg">
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-foreground">Créé</span>
                      </div>
                      <div className="space-y-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full mx-auto flex items-center justify-center animate-pulse shadow-lg">
                          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-primary">En cours</span>
                      </div>
                      <div className="space-y-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full mx-auto flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">Libéré</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="pt-5 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-medium text-muted-foreground">Montant escrow</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold text-primary">2 500</span>
                        <span className="text-lg sm:text-xl font-semibold text-primary">€</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Libération dans 3 jours</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Glow */}
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}