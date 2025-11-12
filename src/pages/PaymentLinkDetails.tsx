import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/layout/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DeliverButton } from "@/components/ui/deliver-button";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Calendar, 
  Euro, 
  FileText, 
  Link2, 
  User, 
  Mail,
  Copy,
  Check,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Package
} from "lucide-react";
import { PaymentLink } from "@/components/ui/payment-link-card";

// Mock data - à remplacer par de vraies données plus tard
const mockPaymentLinks: PaymentLink[] = [
  {
    id: "1",
    clientName: "Marie Dubois",
    projectName: "Site vitrine restaurant",
    amount: 2500,
    status: "paid",
    createdAt: "2024-01-15",
    expiresAt: "2024-02-15",
    pdfUrl: "/contract.pdf",
    linkUrl: "https://holdpay.io/pay/abc123",
    freelancer_id: "user123"
  },
  {
    id: "2", 
    clientName: "Jean Martin",
    projectName: "Application mobile",
    amount: 8500,
    status: "delivered",
    createdAt: "2024-01-10",
    expiresAt: "2024-02-10",
    pdfUrl: "/proposal.pdf",
    linkUrl: "https://holdpay.io/pay/def456",
    freelancer_id: "user123"
  },
  {
    id: "3",
    clientName: "Sophie Laurent",
    projectName: "Refonte logo & identité",
    amount: 1200,
    status: "pending",
    createdAt: "2024-01-20",
    expiresAt: "2024-02-20",
    linkUrl: "https://holdpay.io/pay/ghi789",
    freelancer_id: "user456"
  }
];

export default function PaymentLinkDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  
  // Mock current user - à remplacer par une vraie authentification
  const currentUserId = "user123";

  // Trouver le payment link correspondant
  const paymentLink = mockPaymentLinks.find(link => link.id === id);

  useEffect(() => {
    if (!paymentLink) {
      navigate("/dashboard");
    }
  }, [paymentLink, navigate]);

  if (!paymentLink) {
    return null;
  }

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      toast({
        title: "Copié !",
        description: `${type} copié dans le presse-papier`
      });
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'delivered':
        return <Package className="h-5 w-5 text-primary" />;
      case 'released':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'expired':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const isExpired = new Date(paymentLink.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Navigation isAuthenticated={true} />
      
      <div className="container mx-auto px-6 py-24 max-w-4xl">
        {/* Header avec bouton retour */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            className="mb-6 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au dashboard
          </Button>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-medium text-foreground mb-2">
                Détails du paiement
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                {paymentLink.projectName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(paymentLink.status)}
              <StatusBadge status={paymentLink.status} />
              {isExpired && (
                <Badge variant="destructive" className="ml-2">
                  Expiré
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-8">
            {/* Détails du projet */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations du projet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Client</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{paymentLink.clientName}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Montant</label>
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-semibold text-foreground">
                        {paymentLink.amount.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date de création</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {new Date(paymentLink.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date d'expiration</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={`text-foreground ${isExpired ? 'text-destructive' : ''}`}>
                        {new Date(paymentLink.expiresAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lien de paiement */}
                <div className="space-y-3 p-4 bg-background/50 rounded-xl border">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Lien de paiement
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-background/80 p-3 rounded-lg border text-muted-foreground break-all">
                      {paymentLink.linkUrl}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(paymentLink.linkUrl, "Lien")}
                      className="shrink-0"
                    >
                      {copiedItem === "Lien" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Document attaché */}
                {paymentLink.pdfUrl && (
                  <div className="space-y-3 p-4 bg-background/50 rounded-xl border">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Document attaché
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Contrat / Devis</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={paymentLink.pdfUrl} download>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historique des actions */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle>Historique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <div className="p-2 bg-primary/20 rounded-full">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lien créé</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(paymentLink.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  
                  {paymentLink.status !== "pending" && (
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <div className="p-2 bg-success/20 rounded-full">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Paiement reçu</p>
                        <p className="text-xs text-muted-foreground">
                          Fonds sécurisés en attente de livraison
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {paymentLink.status === "delivered" && (
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <div className="p-2 bg-primary/20 rounded-full">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Projet livré</p>
                        <p className="text-xs text-muted-foreground">
                          En attente de validation client
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bouton de livraison */}
                <DeliverButton
                  paymentLinkId={paymentLink.id}
                  paymentLink={{
                    status: paymentLink.status,
                    freelancer_id: paymentLink.freelancer_id,
                    client_email: "client@example.com", // À récupérer depuis la vraie DB
                    client_name: paymentLink.clientName,
                    project_name: paymentLink.projectName,
                    link_url: paymentLink.linkUrl
                  }}
                  currentUserId={currentUserId}
                  refetch={() => {
                    // Fonction de rafraîchissement
                    console.log("Refreshing payment link details...");
                  }}
                />

                {/* Autres actions */}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleCopy(paymentLink.linkUrl, "Lien")}
                >
                  {copiedItem === "Lien" ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copier le lien
                    </>
                  )}
                </Button>

                {paymentLink.pdfUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={paymentLink.pdfUrl} download>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le PDF
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Statistiques rapides */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Statut</span>
                    <StatusBadge status={paymentLink.status} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Jours restants</span>
                    <span className={`text-sm font-medium ${isExpired ? 'text-destructive' : 'text-foreground'}`}>
                      {isExpired ? 'Expiré' : Math.ceil((new Date(paymentLink.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Document</span>
                    <span className="text-sm font-medium text-foreground">
                      {paymentLink.pdfUrl ? 'Attaché' : 'Aucun'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}