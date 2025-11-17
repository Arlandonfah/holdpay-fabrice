import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { useRevolutPay } from "@/hooks/useRevolutPay";
import { supabase } from "@/integrations/supabase/client";
import { Shield, FileText, CreditCard, CheckCircle, Clock, Euro, Download, Loader2 } from "lucide-react";

interface PaymentLinkData {
  id: string;
  project_name: string;
  client_name: string;
  client_email?: string;
  amount: number;
  status: 'pending' | 'paid' | 'delivered' | 'released' | 'expired' | 'processing';
  created_at: string;
  expires_at: string;
  pdf_url?: string;
  link_url: string;
  freelancer_id: string;
  description?: string;
}

export default function ClientPayment() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createPayment, loading: revolutLoading } = useRevolutPay();

  const [paymentData, setPaymentData] = useState<PaymentLinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Récupérer les données du lien de paiement
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // Récupérer le lien de paiement par son slug/URL
        // Essayer d'abord avec l'URL complète, puis avec juste le slug
        let data, fetchError;

        // Première tentative avec l'URL complète
        const result1 = await (supabase as any)
          .from('payments')
          .select('*')
          .eq('link_url', `${window.location.origin}/pay/${slug}`)
          .single();

        if (result1.error) {
          // Deuxième tentative avec une recherche par slug dans l'URL
          const result2 = await (supabase as any)
            .from('payments')
            .select('*')
            .like('link_url', `%/pay/${slug}`)
            .single();

          data = result2.data;
          fetchError = result2.error;
        } else {
          data = result1.data;
          fetchError = result1.error;
        }

        console.log('Recherche de paiement:', {
          slug,
          searchUrl: `${window.location.origin}/pay/${slug}`,
          data,
          error: fetchError
        });

        if (fetchError) {
          console.error('Erreur récupération:', fetchError);
          setError('Lien de paiement non trouvé');
          return;
        }

        if (!data) {
          setError('Lien de paiement non trouvé');
          return;
        }

        setPaymentData(data);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [slug]);

  const isExpired = paymentData ? new Date(paymentData.expires_at) < new Date() : false;
  const canPay = paymentData?.status === "pending" && !isExpired;

  const handlePayment = async () => {
    if (!paymentData) return;

    setIsProcessing(true);

    try {
      // Créer le paiement Revolut
      const checkoutUrl = await createPayment(paymentData.id, {
        amount: paymentData.amount,
        currency: 'EUR',
        description: `Paiement pour ${paymentData.project_name}`,
        clientEmail: paymentData.client_email,
        clientName: paymentData.client_name
      });

      if (checkoutUrl) {
        // Rediriger vers Revolut Pay
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Impossible de créer le paiement');
      }
    } catch (error: any) {
      console.error('Erreur paiement:', error);
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors du paiement. Veuillez réessayer.",
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

  // Affichage du loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement du lien de paiement...</p>
        </div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="text-center py-8">
            <Clock className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-medium text-foreground mb-2">Lien non trouvé</h2>
            <p className="text-muted-foreground mb-4">
              {error || "Ce lien de paiement n'existe pas ou a expiré."}
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  Ce lien a expiré le {paymentData ? new Date(paymentData.expires_at).toLocaleDateString("fr-FR") : ''}
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
                  {paymentData?.project_name || 'Chargement...'}
                </CardTitle>
                <p className="text-muted-foreground font-light">
                  Pour {paymentData?.client_name || 'Client'}
                </p>
              </div>
              <StatusBadge status={paymentData?.status as any || 'pending'} />
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Description */}
            <div>
              <h3 className="font-medium mb-3 text-foreground">Description du projet</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                {paymentData?.description || 'Description du projet non disponible'}
              </p>
            </div>

            {/* Montant */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-foreground">Montant total</span>
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-medium text-primary">
                    {paymentData?.amount.toLocaleString("fr-FR") || '0'} €
                  </span>
                </div>
              </div>
            </div>

            {/* Document PDF */}
            {paymentData?.pdf_url && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Document contractuel</p>
                      <p className="text-sm text-muted-foreground font-light">
                        Document contractuel
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
                      Payer {paymentData?.amount.toLocaleString("fr-FR") || '0'} € avec Revolut Pay
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