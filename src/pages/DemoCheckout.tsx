import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CreditCard, CheckCircle, XCircle, Loader2, Euro } from "lucide-react";

export default function DemoCheckout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [processing, setProcessing] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const orderId = searchParams.get('order_id');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');

    useEffect(() => {
        
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSuccess();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAutoSuccess = () => {
        setProcessing(true);
        setTimeout(() => {
            navigate(`/payment/success?order_id=${orderId}&revolut_order_id=${orderId}`);
        }, 2000);
    };

    const handleManualSuccess = () => {
        setProcessing(true);
        setTimeout(() => {
            navigate(`/payment/success?order_id=${orderId}&revolut_order_id=${orderId}`);
        }, 1500);
    };

    const handleManualFailure = () => {
        navigate(`/payment/failure?order_id=${orderId}&error_code=PAYMENT_DECLINED&error_message=Paiement refusé pour test`);
    };

    if (processing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Traitement du paiement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
            {/* Header Revolut simulé */}
            <div className="border-b bg-white/10 backdrop-blur-xl border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">R</span>
                        </div>
                        <span className="font-medium text-xl text-foreground">Revolut Pay</span>
                        <span className="text-muted-foreground">- Mode Démonstration</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-md">
                {/* Bannière de démonstration */}
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">Mode Démonstration</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Ceci est une simulation de Revolut Pay pour les tests
                    </p>
                </div>

                {/* Carte de paiement */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-foreground">
                            Confirmer le paiement
                        </CardTitle>
                        <p className="text-muted-foreground">
                            Commande #{orderId?.slice(-8)}
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Montant */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Euro className="h-6 w-6 text-primary" />
                                <span className="text-3xl font-bold text-foreground">
                                    {amount} {currency}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Montant à payer
                            </p>
                        </div>

                        {/* Simulation automatique */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-primary/20 rounded-full">
                                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Paiement automatique</p>
                                    <p className="text-sm text-muted-foreground">
                                        Succès automatique dans {countdown}s
                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-muted/20 rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Actions manuelles */}
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground text-center">
                                Ou testez manuellement :
                            </p>

                            <Button
                                onClick={handleManualSuccess}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Simuler un succès
                            </Button>

                            <Button
                                onClick={handleManualFailure}
                                variant="outline"
                                className="w-full border-red-500/20 text-red-600 hover:bg-red-500/10"
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Simuler un échec
                            </Button>
                        </div>

                        {/* Informations */}
                        <div className="text-center text-xs text-muted-foreground font-light border-t border-white/20 pt-4">
                            <p>
                                🎭 Mode démonstration Revolut Pay
                                <br />
                                Aucun vrai paiement ne sera effectué
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
