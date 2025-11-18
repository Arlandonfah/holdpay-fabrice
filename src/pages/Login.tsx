import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/layout/navigation";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { createTestUser, testLogin, checkSupabaseConfig } from "@/utils/createTestUser";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAuthenticated } = useAuthContext();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);

      if (result.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
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
            <CardTitle className="text-2xl">Se connecter</CardTitle>
            <p className="text-muted-foreground">
              Accédez à votre dashboard Holdpay
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  "Connexion en cours..."
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Boutons de test temporaires - À SUPPRIMER EN PRODUCTION */}
            {/* <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3 font-medium">🧪 Outils de diagnostic (DEV uniquement)</p>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={async () => {
                    await checkSupabaseConfig();
                  }}
                >
                  Vérifier config Supabase
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={async () => {
                    const result = await createTestUser();
                    toast({
                      title: result.success ? "Utilisateur créé" : "Erreur",
                      description: result.success ? "Vérifiez la console" : "Voir console pour détails",
                      variant: result.success ? "default" : "destructive"
                    });
                  }}
                >
                  Créer utilisateur test
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={async () => {
                    const result = await testLogin();
                    toast({
                      title: result.success ? "Test connexion OK" : "Test connexion échoué",
                      description: "Vérifiez la console",
                      variant: result.success ? "default" : "destructive"
                    });
                  }}
                >
                  Tester connexion directe
                </Button>
              </div>
            </div> */}

            <div className="mt-6 text-center space-y-2">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary underline"
              >
                Mot de passe oublié ?
              </Link>

              <div className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  S'inscrire
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}