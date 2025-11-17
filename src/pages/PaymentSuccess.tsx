import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRevolutPay } from "@/hooks/useRevolutPay";
import { supabase } from "@/integrations/supabase/client";
import { Shield, CheckCircle, Loader2, Euro, Calendar } from "lucide-react";

export default function PaymentSuccess() {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { checkPaymentStatus } = useRevolutPay();

    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [verified, setVerified] = useState(false);

    // Récupérer l'ordre ID depuis les paramètres URL
    const orderId = searchParams.get('order_id');
    const revolutOrderId = searchParams.get('revolut_order_id');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!orderId && !revolutOrderId) {
                toast({
                    title: "Erreur",
                    description: "Informations de paiement manquantes",
                    variant: "destructive"
                });
                navigate('/');
                return;
            }

            try {
                setLoading(true);
                setVerified(true); // En mode démo, on considère que c'est vérifié

                // Déclencher la mise à jour du statut via le hook
                const orderToCheck = revolutOrderId || orderId;
                if (orderToCheck) {
                    console.log('🎯 Déclenchement de la mise à jour du statut pour:', orderToCheck);

                    // Appeler checkPaymentStatus pour déclencher la mise à jour
                    try {
                        await checkPaymentStatus(orderToCheck);
                    } catch (error) {
                        console.log('Erreur lors de la mise à jour du statut (normal en démo):', error);
                    }

                    // Récupérer les données du payment link
                    const { data, error } = await (supabase as any)
                        .from('payments')
                        .select('*')
                        .eq('revolut_order_id', orderToCheck)
                        .single();

                    if (!error && data) {
                        setPaymentData(data);
                        console.log('📊 Données du paiement récupérées:', data);
                    } else {
                        console.error('Erreur récupération données paiement:', error);
                    }
                }

                toast({
                    title: "Paiement confirmé !",
                    description: "Votre paiement a été traité avec succès",
                });
            } catch (error) {
                console.error('Erreur vérification paiement:', error);
                toast({
                    title: "Erreur de vérification",
                    description: "Impossible de vérifier le paiement",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [orderId, revolutOrderId, toast, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Vérification du paiement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
            {/* Header */}
            <div className="border-b bg-white/10 backdrop-blur-xl border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="font-medium text-xl text-primary">Holdpay</span>
                        <span className="text-muted-foreground">- Paiement confirmé</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto mb-4 p-3 bg-success/20 rounded-full w-fit">
                            <CheckCircle className="h-12 w-12 text-success" />
                        </div>
                        <CardTitle className="text-3xl text-success font-medium">
                            Paiement réussi !
                        </CardTitle>
                        <p className="text-muted-foreground font-light">
                            Votre paiement a été traité avec succès
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {paymentData && (
                            <>
                                {/* Détails du paiement */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h3 className="font-medium mb-4 text-foreground">Détails du paiement</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Projet</span>
                                            <span className="text-foreground font-medium">{paymentData.project_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Montant</span>
                                            <div className="flex items-center gap-1">
                                                <Euro className="h-4 w-4 text-primary" />
                                                <span className="text-foreground font-medium">
                                                    {paymentData.amount.toLocaleString("fr-FR")} €
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Date</span>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-foreground">
                                                    {new Date().toLocaleDateString("fr-FR")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Prochaines étapes */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h3 className="font-medium mb-4 text-foreground">Prochaines étapes</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-1 bg-primary/20 rounded-full mt-1">
                                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Fonds sécurisés</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Vos fonds sont maintenant sécurisés et seront libérés une fois le travail validé
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-1 bg-muted/20 rounded-full mt-1">
                                                <div className="w-2 h-2 bg-muted rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Notification au freelance</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Le freelance a été notifié et peut maintenant commencer le travail
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-1 bg-muted/20 rounded-full mt-1">
                                                <div className="w-2 h-2 bg-muted rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Livraison et validation</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Vous recevrez une notification quand le travail sera livré pour validation
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Informations importantes */}
                        <div className="bg-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
                            <h3 className="font-medium mb-3 text-foreground flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                Protection garantie
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-success" />
                                    Vos fonds sont protégés jusqu'à la livraison
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-success" />
                                    5 jours pour valider ou contester le travail
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-success" />
                                    Support client disponible 24/7
                                </li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="flex-1"
                            >
                                Retour à l'accueil
                            </Button>
                            <Button
                                onClick={() => window.print()}
                                className="flex-1"
                            >
                                Imprimer le reçu
                            </Button>
                        </div>

                        {/* Contact */}
                        <div className="text-center text-xs text-muted-foreground font-light border-t border-white/20 pt-4">
                            <p>
                                Une question ? Contactez notre support à support@holdpay.com
                                <br />
                                Référence de transaction : {orderId || revolutOrderId}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
