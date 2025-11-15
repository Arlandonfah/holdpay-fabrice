import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Lock, Users, TrendingUp, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-20 sm:pt-24 pb-12 sm:pb-16">
      {/* Background Effects - Animated */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 sm:w-80 h-48 sm:h-80 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center space-y-8 sm:space-y-12 lg:space-y-16">
        {/* Badge with animation */}
        <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-card/80 backdrop-blur-md border border-primary/20 rounded-full text-foreground text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
          <span className="hidden sm:inline">Solution de paiement sécurisé pour freelances</span>
          <span className="sm:hidden">Paiement sécurisé freelance</span>
        </div>

        {/* Main Title - Improved hierarchy */}
        <div className="space-y-6 sm:space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.1] tracking-tight text-foreground px-4">
            Ton paiement{" "}
            <span className="relative inline-block">
              <span className="text-primary font-semibold">sécurisé</span>
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </span>
            .<br />
            Ta mission en{" "}
            <span className="relative inline-block">
              <span className="text-primary font-semibold">confiance</span>
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </span>
            .
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Reçois un <strong className="text-foreground">acompte sécurisé</strong> avant de commencer ta mission freelance.
            <br className="hidden sm:block" />
            <span className="inline-flex items-center gap-2 mt-2 text-primary font-medium">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Paiement bloqué • Libération automatique
            </span>
          </p>
        </div>

        {/* CTA Section - More prominent */}
        <div className="flex flex-col gap-4 sm:gap-6 justify-center items-center pt-6 sm:pt-12 px-4">
          <Button
            size="lg"
            asChild
            className="group text-base sm:text-lg lg:text-xl px-8 sm:px-12 lg:px-16 py-5 sm:py-6 lg:py-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-semibold shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto max-w-md"
          >
            <Link to="/register" className="flex items-center justify-center">
              <span className="hidden sm:inline">Créer mon lien de paiement</span>
              <span className="sm:hidden">Créer mon lien</span>
              <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            Gratuit pendant 30 jours • Aucune carte requise
          </p>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto pt-8 sm:pt-12 px-4">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:bg-card/80 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">500+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Freelances</div>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:bg-card/80 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">50K€</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Sécurisés</div>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:bg-card/80 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Sécurisé</div>
          </div>
        </div>

        {/* Visual Element - Enhanced */}
        <div className="pt-12 sm:pt-20 flex justify-center px-4">
          <div className="relative group">
            <div className="bg-card/80 backdrop-blur-md p-8 sm:p-12 lg:p-16 rounded-3xl border border-border shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
              <Lock className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-primary mx-auto animate-pulse" />
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}