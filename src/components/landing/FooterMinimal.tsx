import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function FooterMinimal() {
  return (
    <footer className="bg-background border-t border-border py-16 px-4">
      <div className="max-w-container mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-primary-hover p-2 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Holdpay</span>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              La solution de paiement sécurisé qui transforme tes relations clients freelance.
            </p>
          </div>
          
          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Légal</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/mentions" className="hover:text-foreground transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Support</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-foreground transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-foreground transition-colors">
                  Statut système
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border mt-16 pt-8 text-center">
          <p className="text-muted-foreground">
            &copy; 2024 Holdpay. Tous droits réservés. Made with ❤️ for freelances.
          </p>
        </div>
      </div>
    </footer>
  );
}