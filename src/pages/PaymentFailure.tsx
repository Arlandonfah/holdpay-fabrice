import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, XCircle, RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react";

export default function PaymentFailure() {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [paymentData, setPaymentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Récupérer les paramètres d'erreur
    const errorCode = searchParams.get('error_code');
    const errorMessage = searchParams.get('error_message');
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        const fetchPaymentData = async () => {
            if (!slug) return;

            try {
                // Récupérer les données du payment link pour permettre un nouveau paiement
                const { data, error } = await (supabase as any)
                    .from('payments')
                    .select('*')
                    .eq('link_url', `${window.location.origin}/pay/${slug}`)
                    .single();

                if (!error && data) {
                    setPaymentData(data);
                }
            } catch (error) {
                console.error('Erreur récupération données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, [slug]);

    const getErrorMessage = (code: string | null) => {
        switch (code) {
            case 'PAYMENT_DECLINED':
                return 'Votre paiement a été refusé par votre banque. Veuillez vérifier vos informations ou utiliser une autre carte.';
            case 'INSUFFICIENT_FUNDS':
                return 'Fonds insuffisants sur votre compte. Veuillez vérifier votre solde ou utiliser une autre carte.';
            case 'CARD_EXPIRED':
                return 'Votre carte a expiré. Veuillez utiliser une carte valide.';
            case 'INVALID_CARD':
                return 'Les informations de votre carte sont invalides. Veuillez vérifier et réessayer.';
            case 'PAYMENT_CANCELLED':
                return 'Le paiement a été annulé. Vous pouvez réessayer quand vous le souhaitez.';
            case 'TIMEOUT':
                return 'Le paiement a expiré. Veuillez réessayer.';
            default:
                return errorMessage || 'Une erreur est survenue lors du paiement. Veuillez réessayer.';
        }
    };

    const handleRetryPayment = () => {
        if (slug) {
            navigate(`/pay/${slug}`);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
            {/* Header */}
            <div className="border-b bg-white/10 backdrop-blur-xl border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="font-medium text-xl text-primary">Holdpay</span>
                        <span className="text-muted-foreground">- Paiement échoué</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto mb-4 p-3 bg-destructive/20 rounded-full w-fit">
                            <XCircle className="h-12 w-12 text-destructive" />
                        </div>
                        <CardTitle className="text-3xl text-destructive font-medium">
                            Paiement échoué
                        </CardTitle>
                        <p className="text-muted-foreground font-light">
                            Votre paiement n'a pas pu être traité
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Message d'erreur */}
                        <div className="bg-destructive/10 backdrop-blur-sm rounded-2xl p-6 border border-destructive/20">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                                <div>
                                    <h3 className="font-medium mb-2 text-foreground">Raison de l'échec</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {getErrorMessage(errorCode)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Détails du paiement si disponibles */}
                        {paymentData && (
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <h3 className="font-medium mb-4 text-foreground">Détails du paiement</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Projet</span>
                                        <span className="text-foreground font-medium">{paymentData.project_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Montant</span>
                                        <span className="text-foreground font-medium">
                                            {paymentData.amount.toLocaleString("fr-FR")} €
                                        </span>
                                    </div>
                                    {orderId && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Référence</span>
                                            <span className="text-foreground font-mono text-sm">{orderId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Solutions possibles */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <h3 className="font-medium mb-4 text-foreground">Solutions possibles</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <div className="p-1 bg-primary/20 rounded-full mt-1">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    </div>
                                    <span>Vérifiez que votre carte a suffisamment de fonds</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="p-1 bg-primary/20 rounded-full mt-1">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    </div>
                                    <span>Assurez-vous que votre carte n'a pas expiré</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="p-1 bg-primary/20 rounded-full mt-1">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    </div>
                                    <span>Contactez votre banque si le problème persiste</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="p-1 bg-primary/20 rounded-full mt-1">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    </div>
                                    <span>Essayez avec une autre carte de paiement</span>
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
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour à l'accueil
                            </Button>
                            {paymentData && (
                                <Button
                                    onClick={handleRetryPayment}
                                    className="flex-1 bg-primary hover:bg-primary-hover"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Réessayer le paiement
                                </Button>
                            )}
                        </div>

                        {/* Support */}
                        <div className="bg-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
                            <h3 className="font-medium mb-3 text-foreground flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                Besoin d'aide ?
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Notre équipe support est là pour vous aider à résoudre ce problème.
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                                Contacter le support
                            </Button>
                        </div>

                        {/* Informations de contact */}
                        <div className="text-center text-xs text-muted-foreground font-light border-t border-white/20 pt-4">
                            <p>
                                Support disponible 24/7 : support@holdpay.com
                                <br />
                                {orderId && `Référence d'erreur : ${orderId}`}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
