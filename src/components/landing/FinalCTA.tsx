import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle, Zap } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 px-6">
      <div className="max-w-container mx-auto text-center">
        <div className="space-y-16">
          {/* Title */}
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-foreground">
              Crée ton lien en{" "}
              <span className="text-primary font-medium">1 minute</span>
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light px-4">
              Rejoins les centaines de freelances qui sécurisent leurs missions avec Holdpay.
              <br className="hidden sm:block" />
              Simple, rapide, et 100% sécurisé.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-8 sm:gap-12 text-muted-foreground">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-base font-light">Gratuit pendant 30 jours</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-base font-light">Setup en 2 minutes</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-base font-light">Powered by Stripe</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button 
              size="lg" 
              asChild 
              className="text-xl px-12 py-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-medium shadow-sm hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
            >
              <Link to="/register">
                <span className="hidden sm:inline">Démarrer maintenant</span>
                <span className="sm:hidden">Démarrer</span>
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicator */}
          <div className="text-sm text-muted-foreground pt-8 font-light">
            ✨ Aucune carte bancaire requise pour commencer
          </div>
        </div>
      </div>
    </section>
  );
}