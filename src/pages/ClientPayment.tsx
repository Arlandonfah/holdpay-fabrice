import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, FileText, CreditCard, CheckCircle, Clock, Euro, Download } from "lucide-react";

// Mock data - normalement récupéré via l'URL slug
const mockPaymentData = {
  id: "abc123",
  freelancerName: "Marie Dubois",
  projectName: "Site vitrine restaurant",
  description: "Développement d'un site vitrine responsive avec système de réservation en ligne, optimisé SEO et mobile-first.",
  amount: 2500,
  status: "pending" as const,
  createdAt: "2024-01-15",
  expiresAt: "2024-02-15",
  pdfUrl: "/contract.pdf",
  contractName: "Contrat-Site-Restaurant.pdf"
};

export default function ClientPayment() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const isExpired = new Date(mockPaymentData.expiresAt) < new Date();
  const canPay = mockPaymentData.status === "pending" && !isExpired && !paymentCompleted;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulation du paiement Stripe - à remplacer par la vraie intégration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setPaymentCompleted(true);
      toast({
        title: "Paiement réussi !",
        description: "Vos fonds sont maintenant sécurisés. Le freelance va pouvoir commencer le travail.",
      });
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du paiement. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = () => {
    // Simulation du téléchargement
    toast({
      title: "Téléchargement en cours",
      description: "Le document va s'ouvrir dans un nouvel onglet"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Header simple sans navigation */}
      <div className="border-b bg-white/10 backdrop-blur-xl border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-medium text-xl text-primary">Holdpay</span>
            <span className="text-muted-foreground">- Paiement sécurisé</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Status Banner */}
        {paymentCompleted && (
          <Card className="mb-6 bg-success/10 backdrop-blur-md border border-success/20">
            <CardContent className="flex items-center gap-3 py-4">
              <CheckCircle className="h-6 w-6 text-success" />
              <div>
                <p className="font-medium text-success">Paiement effectué avec succès</p>
                <p className="text-sm text-muted-foreground">
                  Vos fonds sont sécurisés et seront libérés une fois le travail validé
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isExpired && (
          <Card className="mb-6 bg-destructive/10 backdrop-blur-md border border-destructive/20">
            <CardContent className="flex items-center gap-3 py-4">
              <Clock className="h-6 w-6 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Lien de paiement expiré</p>
                <p className="text-sm text-muted-foreground">
                  Ce lien a expiré le {new Date(mockPaymentData.expiresAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Payment Card */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl text-primary font-medium">
                  {mockPaymentData.projectName}
                </CardTitle>
                <p className="text-muted-foreground font-light">
                  Proposé par {mockPaymentData.freelancerName}
                </p>
              </div>
              <StatusBadge status={paymentCompleted ? "paid" : mockPaymentData.status} />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Description */}
            <div>
              <h3 className="font-medium mb-3 text-foreground">Description du projet</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                {mockPaymentData.description}
              </p>
            </div>

            {/* Montant */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-foreground">Montant total</span>
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-medium text-primary">
                    {mockPaymentData.amount.toLocaleString("fr-FR")} €
                  </span>
                </div>
              </div>
            </div>

            {/* Document PDF */}
            {mockPaymentData.pdfUrl && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Document contractuel</p>
                      <p className="text-sm text-muted-foreground font-light">
                        {mockPaymentData.contractName}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            )}

            {/* Garanties */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4 border border-white/20">
              <h3 className="font-medium flex items-center gap-2 text-foreground">
                <Shield className="h-4 w-4 text-primary" />
                Vos garanties Holdpay
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Fonds sécurisés par Stripe jusqu'à la livraison
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  5 jours pour valider ou contester le travail livré
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Remboursement garanti en cas de litige justifié
                </li>
              </ul>
            </div>

            {/* Bouton de paiement */}
            <div className="pt-4">
              {canPay ? (
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full text-lg py-6 bg-primary/90 backdrop-blur-md border border-primary/20 hover:bg-primary shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <CreditCard className="h-5 w-5 mr-2 animate-pulse" />
                      Traitement du paiement...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payer {mockPaymentData.amount.toLocaleString("fr-FR")} € maintenant
                    </>
                  )}
                </Button>
              ) : paymentCompleted ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-success mx-auto" />
                  <p className="font-medium text-success">Paiement effectué</p>
                  <p className="text-sm text-muted-foreground font-light">
                    Vous recevrez une notification quand le travail sera livré
                  </p>
                </div>
              ) : (
                <Button disabled size="lg" className="w-full text-lg py-6">
                  Paiement non disponible
                </Button>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div className="text-center text-xs text-muted-foreground font-light">
              <p>
                En procédant au paiement, vous acceptez nos conditions d'utilisation.
                <br />
                Paiement sécurisé par Stripe • Protection des données garantie
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}