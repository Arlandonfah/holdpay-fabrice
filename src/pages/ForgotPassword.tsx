import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/layout/navigation";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { KeyRound, Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
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
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {emailSent ? "Email envoyé !" : "Mot de passe oublié ?"}
            </CardTitle>
            <p className="text-muted-foreground">
              {emailSent 
                ? "Nous vous avons envoyé un lien de réinitialisation par email"
                : "Entrez votre email pour réinitialiser votre mot de passe"
              }
            </p>
          </CardHeader>
          
          <CardContent>
            {!emailSent ? (
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Envoyer le lien
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm text-center">
                    Un email a été envoyé à <strong>{email}</strong>
                  </p>
                </div>
                
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Renvoyer l'email
                </Button>
              </div>
            )}

            <div className="mt-6 text-center space-y-2">
              <Link 
                to="/login" 
                className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
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
