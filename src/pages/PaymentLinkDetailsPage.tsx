import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/layout/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DeliverButton } from "@/components/ui/deliver-button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Calendar,
  Euro,
  FileText,
  User,
  Mail,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Loader2
} from "lucide-react";

type PaymentStatus = 'pending' | 'paid' | 'delivered' | 'released' | 'expired';

interface PaymentLinkData {
  id: string;
  project_name: string;
  client_name: string;
  client_email?: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  expires_at: string;
  delivered_at?: string;
  pdf_url?: string;
  link_url: string;
  freelancer_id: string;
}

export default function PaymentLinkDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [paymentLink, setPaymentLink] = useState<PaymentLinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

 
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/login");
        return;
      }

      setUser(session.user);
    };

    checkAuth();

    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate("/login");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);


  useEffect(() => {
    const fetchPaymentLink = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await (supabase as any)
          .from('payments')
          .select('*')
          .eq('id', id)
          .eq('freelancer_id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError("Lien de paiement non trouvé ou vous n'avez pas accès à ce lien.");
          } else {
            throw fetchError;
          }
          return;
        }

        if (!data) {
          setError("Lien de paiement non trouvé.");
          return;
        }

        setPaymentLink(data as PaymentLinkData);
      } catch (error: any) {
        console.error('Erreur lors de la récupération du payment link:', error);
        setError("Erreur lors du chargement des données.");
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du lien de paiement",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentLink();
  }, [id, user, toast]);

  const refetchPaymentLink = async () => {
    if (!id || !user) return;

    try {
      const { data, error: fetchError } = await (supabase as any)
        .from('payments')
        .select('*')
        .eq('id', id)
        .eq('freelancer_id', user.id)
        .single();

      if (fetchError) throw fetchError;
      if (data) setPaymentLink(data as PaymentLinkData);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <Navigation isAuthenticated={true} />
        <div className="container mx-auto px-6 py-24 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Chargement...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <Navigation isAuthenticated={true} />
        <div className="container mx-auto px-6 py-24 max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au dashboard
          </Button>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <div className="space-y-6">
              <div className="p-6 bg-destructive/20 backdrop-blur-sm rounded-2xl w-fit mx-auto border border-destructive/30">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-medium text-foreground">Accès refusé</h3>
                <p className="text-muted-foreground">
                  {error || "Vous n'avez pas accès à ce lien de paiement."}
                </p>
              </div>
              <Button onClick={() => navigate("/dashboard")}>
                Retour au dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const isExpired = new Date(paymentLink.expires_at) < new Date();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                {paymentLink.project_name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(paymentLink.status)}
              <StatusBadge status={paymentLink.status as any} />
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
                      <span className="text-foreground">{paymentLink.client_name}</span>
                    </div>
                  </div>

                  {paymentLink.client_email && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email client</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{paymentLink.client_email}</span>
                      </div>
                    </div>
                  )}

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
                        {formatDate(paymentLink.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date d'expiration</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={`text-foreground ${isExpired ? 'text-destructive' : ''}`}>
                        {formatDate(paymentLink.expires_at)}
                      </span>
                    </div>
                  </div>

                  {paymentLink.delivered_at && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date de livraison</label>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-foreground">
                          {formatDate(paymentLink.delivered_at)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Document attaché */}
                {paymentLink.pdf_url && (
                  <div className="space-y-3 p-4 bg-background/50 rounded-xl border">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Document attaché
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Contrat / Devis</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={paymentLink.pdf_url} download>
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
                        {formatDate(paymentLink.created_at)}
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

                  {paymentLink.delivered_at && (
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <div className="p-2 bg-primary/20 rounded-full">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Projet livré</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(paymentLink.delivered_at)}
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
                {paymentLink.status === 'paid' && (
                  <DeliverButton
                    paymentLinkId={paymentLink.id}
                    paymentLink={{
                      status: paymentLink.status,
                      freelancer_id: paymentLink.freelancer_id,
                      client_email: paymentLink.client_email,
                      client_name: paymentLink.client_name,
                      project_name: paymentLink.project_name,
                      link_url: paymentLink.link_url
                    }}
                    currentUserId={user?.id}
                    refetch={refetchPaymentLink}
                  />
                )}

                {paymentLink.pdf_url && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={paymentLink.pdf_url} download>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le PDF
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Informations résumées */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Statut</span>
                    <StatusBadge status={paymentLink.status as any} />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Jours restants</span>
                    <span className={`text-sm font-medium ${isExpired ? 'text-destructive' : 'text-foreground'}`}>
                      {isExpired ? 'Expiré' : Math.ceil((new Date(paymentLink.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Document</span>
                    <span className="text-sm font-medium text-foreground">
                      {paymentLink.pdf_url ? 'Attaché' : 'Aucun'}
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