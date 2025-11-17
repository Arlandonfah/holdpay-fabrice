import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigation } from "@/components/layout/navigation";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Register() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { signUp } = useAuthContext();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: "Conditions d'utilisation",
        description: "Veuillez accepter les conditions d'utilisation",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      if (result.success) {
        // Supabase peut nécessiter une confirmation email
        toast({
          title: "Compte créé !",
          description: "Vérifiez votre email pour confirmer votre compte, puis connectez-vous."
        });
        navigate("/login");
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation isAuthenticated={false} />

      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Créer un compte</CardTitle>
            <p className="text-muted-foreground">
              Rejoignez Holdpay et sécurisez vos paiements
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  J'accepte les{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    conditions d'utilisation
                  </Link>
                  {" "}et la{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  "Création du compte..."
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                Déjà un compte ?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}