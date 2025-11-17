import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/layout/navigation";
import { PaymentLinkCard } from "@/components/ui/payment-link-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Plus, BarChart3, Euro, TrendingUp, Copy, Check } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { usePaymentLinks } from "@/hooks/usePaymentLinks";

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isAuthenticated, userName, signOut, user } = useAuthContext();
  const { paymentLinks, loading, error, refetch } = usePaymentLinks();

  // Mock current user - à remplacer par une vraie authentification
  const currentUserId = user?.id || "user123";

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(url);
      toast({
        title: "Lien copié !",
        description: "Le lien de paiement a été copié dans le presse-papier"
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (id: string) => {
    // Navigation vers la page de détails avec la nouvelle route
    navigate(`/dashboard/payment-link/${id}`);
  };

  const totalAmount = paymentLinks.reduce((sum, link) => sum + link.amount, 0);
  const paidAmount = paymentLinks
    .filter(link => ["paid", "delivered", "released"].includes(link.status))
    .reduce((sum, link) => sum + link.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Navigation
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLogout={signOut}
      />

      <div className="container mx-auto px-6 py-24 max-w-7xl">
        {/* Header - Style Airbnb épuré */}
        <div className="mb-16">
          <h1 className="text-5xl font-medium text-foreground mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-muted-foreground font-light mb-12">
            Gérez vos paiements en toute simplicité
          </p>

          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-8 py-3 font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Link to="/create">
              <Plus className="h-5 w-5 mr-2" />
              Nouveau lien
            </Link>
          </Button>
        </div>

        {/* Stats Cards - Design épuré avec beaucoup d'espace */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-primary/20 backdrop-blur-sm rounded-xl border border-primary/30">
                <Euro className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total des paiements</p>
              <p className="text-3xl font-light text-foreground">
                {totalAmount.toLocaleString("fr-FR")} €
              </p>
              <p className="text-sm text-success font-medium">+12% ce mois</p>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-success/20 backdrop-blur-sm rounded-xl border border-success/30">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Fonds sécurisés</p>
              <p className="text-3xl font-light text-foreground">
                {paidAmount.toLocaleString("fr-FR")} €
              </p>
              <p className="text-sm text-primary font-medium">
                {Math.round((paidAmount / totalAmount) * 100)}% du total
              </p>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-accent/30 backdrop-blur-sm rounded-xl border border-accent/40">
                <BarChart3 className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Projets actifs</p>
              <p className="text-3xl font-light text-foreground">
                {paymentLinks.filter(link => link.status !== "released").length}
              </p>
              <p className="text-sm text-warning font-medium">En cours</p>
            </div>
          </Card>
        </div>

        {/* Payment Links - Section épurée */}
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-medium text-foreground mb-8">
              Liens de paiement
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement des liens de paiement...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
              <Button onClick={refetch} className="mt-4">Réessayer</Button>
            </div>
          ) : paymentLinks.length > 0 ? (
            <div className="space-y-6">
              {paymentLinks.map((paymentLink) => (
                <PaymentLinkCard
                  key={paymentLink.id}
                  paymentLink={paymentLink}
                  onViewDetails={handleViewDetails}
                  onCopyLink={handleCopyLink}
                  currentUserId={currentUserId}
                  refetch={refetch}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-16 text-center hover:bg-white/15 transition-all duration-300">
              <div className="space-y-8">
                <div className="p-6 bg-white/20 backdrop-blur-sm rounded-2xl w-fit mx-auto border border-white/30">
                  <BarChart3 className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium text-foreground">Prêt à commencer ?</h3>
                  <p className="text-muted-foreground font-light max-w-md mx-auto">
                    Créez votre premier lien de paiement sécurisé en quelques clics
                  </p>
                </div>
                <Button
                  size="lg"
                  asChild
                  className="bg-primary/90 hover:bg-primary backdrop-blur-md border border-primary/20 text-primary-foreground rounded-xl px-8 py-3 shadow-lg"
                >
                  <Link to="/create">
                    <Plus className="h-5 w-5 mr-2" />
                    Créer mon premier lien
                  </Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}