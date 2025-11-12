import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Lock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-24">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-container mx-auto text-center space-y-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-foreground text-sm font-medium shadow-lg">
          <Shield className="h-4 w-4 text-primary" />
          Solution de paiement sécurisé pour freelances
        </div>

        {/* Main Title */}
        <div className="space-y-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight text-foreground">
            Ton paiement{" "}
            <span className="text-primary font-medium">sécurisé</span>.
            <br />
            Ta mission en{" "}
            <span className="text-primary font-medium">confiance</span>.
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light px-4">
            Holdpay.io te permet de recevoir un acompte sécurisé avant de commencer ta mission freelance.
            <br className="hidden sm:block" />
            <span className="text-primary font-medium">Paiement bloqué. Libération automatique à validation.</span>
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-4 justify-center items-center pt-12 px-4">
          <Button 
            size="lg" 
            asChild 
            className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 bg-primary/90 hover:bg-primary backdrop-blur-md border border-primary/20 text-primary-foreground rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
          >
            <Link to="/register">
              <span className="hidden sm:inline">Créer mon lien de paiement</span>
              <span className="sm:hidden">Créer mon lien</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>

        {/* Visual Element */}
        <div className="pt-20 flex justify-center">
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md p-12 rounded-3xl border border-white/20 shadow-2xl">
              <Lock className="h-16 w-16 text-primary mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}