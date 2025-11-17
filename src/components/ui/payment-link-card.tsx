import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, PaymentStatus } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeliverButton } from "@/components/ui/deliver-button";
import { Copy, Eye, FileText, Clock, CheckCircle, CreditCard, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export interface PaymentLink {
  id: string;
  clientName: string;
  projectName: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  expiresAt: string;
  pdfUrl?: string;
  linkUrl: string;
  freelancer_id?: string;
}

interface PaymentLinkCardProps {
  paymentLink: PaymentLink;
  onViewDetails?: (id: string) => void;
  onCopyLink?: (url: string) => void;
  currentUserId?: string;
  refetch?: () => void;
  className?: string;
}

export function PaymentLinkCard({
  paymentLink,
  onViewDetails,
  onCopyLink,
  currentUserId,
  refetch,
  className
}: PaymentLinkCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isExpired = new Date(paymentLink.expiresAt) < new Date();
  const isActive = paymentLink.status === "pending" && !isExpired;
  const isPaid = paymentLink.status === "paid";
  const canPay = isActive && !isPaid;

  // Debug pour voir pourquoi le bouton n'apparaît pas
  console.log('PaymentLinkCard Debug:', {
    id: paymentLink.id,
    status: paymentLink.status,
    expiresAt: paymentLink.expiresAt,
    isExpired,
    isActive,
    linkUrl: paymentLink.linkUrl
  });

  // Extraire le slug depuis l'URL du lien
  const getSlugFromUrl = (url: string) => {
    const parts = url.split('/pay/');
    return parts.length > 1 ? parts[1] : null;
  };

  const handleGoToPayment = () => {
    const slug = getSlugFromUrl(paymentLink.linkUrl);
    if (slug) {
      navigate(`/pay/${slug}`);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink.linkUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien de paiement a été copié dans le presse-papiers",
      });
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      // Fallback pour les navigateurs qui ne supportent pas l'API clipboard
      const textArea = document.createElement('textarea');
      textArea.value = paymentLink.linkUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      toast({
        title: "Lien copié !",
        description: "Le lien de paiement a été copié dans le presse-papiers",
      });
    }
  };

  return (
    <Card className={cn("bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:shadow-2xl transition-all duration-300", className)}>
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h3 className="font-medium text-2xl text-foreground">{paymentLink.projectName}</h3>
              <StatusBadge status={paymentLink.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">CLIENT</p>
                <p className="font-medium text-lg text-foreground">{paymentLink.clientName}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">MONTANT</p>
                <p className="font-medium text-3xl text-primary">{paymentLink.amount.toLocaleString("fr-FR")} €</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Expire le {new Date(paymentLink.expiresAt).toLocaleDateString("fr-FR")}</span>
              </div>

              {paymentLink.pdfUrl && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">Document joint</span>
                </div>
              )}
            </div>

            {isExpired && (
              <Badge variant="destructive" className="w-fit text-sm px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                Lien expiré
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-3 min-w-fit">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onViewDetails?.(paymentLink.id)}
              className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20"
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir les détails
            </Button>

            {canPay && (
              <>
                <Button
                  size="lg"
                  onClick={handleGoToPayment}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payer avec Revolut Pay
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20"
                >
                  <Copy className="h-3 w-3 mr-2" />
                  Copier le lien
                </Button>
              </>
            )}

            {isPaid && (
              <Button
                size="lg"
                disabled
                className="bg-green-600 text-white opacity-75 cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Paiement effectué
              </Button>
            )}

            <DeliverButton
              paymentLinkId={paymentLink.id}
              paymentLink={paymentLink}
              currentUserId={currentUserId}
              refetch={refetch}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}