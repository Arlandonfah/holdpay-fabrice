import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Menu, User, LogOut } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  isAuthenticated: boolean;
  userName?: string;
  onLogout?: () => void;
}

export function Navigation({ isAuthenticated, userName, onLogout }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-primary p-2 rounded-xl">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-medium text-foreground">
              Holdpay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <Link
              to="/features"
              className="text-muted-foreground hover:text-foreground transition-colors font-light text-base"
            >
              Fonctionnalités
            </Link>
            <Link
              to="/pricing"
              className="text-muted-foreground hover:text-foreground transition-colors font-light text-base"
            >
              Tarifs
            </Link>
            <Link
              to="/help"
              className="text-muted-foreground hover:text-foreground transition-colors font-light text-base"
            >
              Support
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-2 text-foreground">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{userName || 'Utilisateur'}</span>
                </div>

                {/* Dashboard Button */}
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-xl px-4 py-2 font-medium"
                >
                  <Link to="/dashboard">Dashboard</Link>
                </Button>

                {/* Logout Button */}
                <Button
                  onClick={onLogout}
                  size="sm"
                  variant="ghost"
                  className="rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild className="font-light text-base">
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-6 py-2 font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <Link to="/register">Commencer</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-8 border-t border-border">
            <div className="flex flex-col gap-6">
              <Link
                to="/features"
                className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link
                to="/pricing"
                className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Tarifs
              </Link>
              <Link
                to="/help"
                className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>

              <div className="flex flex-col gap-4 pt-6 border-t border-border">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    {/* User Info Mobile */}
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm text-foreground">{userName || 'Utilisateur'}</span>
                    </div>

                    {/* Dashboard Button Mobile */}
                    <Button asChild className="w-full rounded-xl">
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    </Button>

                    {/* Logout Button Mobile */}
                    <Button
                      onClick={() => {
                        onLogout?.();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full rounded-xl text-muted-foreground hover:text-foreground hover:bg-destructive/10 border-destructive/20"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="w-full font-light">
                      <Link to="/login">Connexion</Link>
                    </Button>
                    <Button asChild className="w-full rounded-xl">
                      <Link to="/register">Commencer</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}