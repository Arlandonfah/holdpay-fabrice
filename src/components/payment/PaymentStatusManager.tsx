import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Clock,
  CheckCircle,
  Package,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import { PaymentStatus } from '@/types/payment';
import { paymentStatusService } from '@/services/paymentStatusService';

interface PaymentStatusManagerProps {
  paymentId: string;
  currentStatus: PaymentStatus;
  userRole: 'freelancer' | 'client' | 'admin';
  deliveredAt?: string;
  onStatusUpdate?: () => void;
}

export function PaymentStatusManager({
  paymentId,
  currentStatus,
  userRole,
  deliveredAt,
  onStatusUpdate,
}: PaymentStatusManagerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  const getStatusIcon = (status: PaymentStatus) => {
    const icons = {
      pending: Clock,
      paid: CheckCircle,
      delivered: Package,
      released: TrendingUp,
      contested: AlertTriangle,
      refunded: RefreshCw,
      expired: Clock,
    };
    return icons[status] || Clock;
  };

  const StatusIcon = getStatusIcon(currentStatus);

  const handleMarkAsDelivered = async () => {
    setIsLoading(true);
    try {
      await paymentStatusService.markAsDelivered(
        paymentId,
        'freelancer_id', 
        'Projet livré et prêt pour validation'
      );
      
      toast({
        title: 'Projet marqué comme livré',
        description: 'Le client a été notifié et dispose de 5 jours pour valider.',
      });
      
      onStatusUpdate?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer le projet comme livré',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateDelivery = async () => {
    setIsLoading(true);
    try {
      await paymentStatusService.releaseFunds(
        paymentId,
        'client',
        'Validation client - Projet conforme'
      );
      
      toast({
        title: 'Projet validé',
        description: 'Les fonds ont été libérés au freelance.',
      });
      
      onStatusUpdate?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de valider le projet',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDispute = async () => {
    if (!disputeReason.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez décrire le motif du litige',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await paymentStatusService.createDispute(
        paymentId,
        'Qualité non conforme',
        disputeReason
      );
      
      toast({
        title: 'Litige créé',
        description: 'Notre équipe va examiner votre demande sous 48h.',
      });
      
      setShowDisputeForm(false);
      setDisputeReason('');
      onStatusUpdate?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le litige',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canMarkAsDelivered = userRole === 'freelancer' && currentStatus === 'paid';
  const canValidate = userRole === 'client' && currentStatus === 'delivered';
  const canDispute = userRole === 'client' && (currentStatus === 'paid' || currentStatus === 'delivered');
  
  const autoReleaseDate = deliveredAt
    ? new Date(new Date(deliveredAt).getTime() + 5 * 24 * 60 * 60 * 1000)
    : null;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5" />
          Gestion du statut
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statut actuel */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">
            Statut actuel
          </span>
          <Badge variant={paymentStatusService.getStatusColor(currentStatus) as any}>
            {paymentStatusService.getStatusLabel(currentStatus)}
          </Badge>
        </div>

        {/* Auto-release info */}
        {currentStatus === 'delivered' && autoReleaseDate && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Libération automatique
                </p>
                <p className="text-xs text-muted-foreground">
                  Les fonds seront automatiquement libérés le{' '}
                  {autoReleaseDate.toLocaleDateString('fr-FR')} si aucune action n'est prise.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions freelance */}
        {canMarkAsDelivered && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Une fois le projet terminé, marquez-le comme livré pour que le client puisse le valider.
            </p>
            <Button
              onClick={handleMarkAsDelivered}
              disabled={isLoading}
              className="w-full"
            >
              <Package className="h-4 w-4 mr-2" />
              Marquer comme livré
            </Button>
          </div>
        )}

        {/* Actions client */}
        {canValidate && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Le projet a été livré. Validez-le pour libérer les fonds au freelance.
            </p>
            <div className="grid gap-2">
              <Button
                onClick={handleValidateDelivery}
                disabled={isLoading}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Valider et libérer les fonds
              </Button>
              <Button
                onClick={() => setShowDisputeForm(!showDisputeForm)}
                variant="outline"
                className="w-full"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Signaler un problème
              </Button>
            </div>
          </div>
        )}

        {/* Formulaire de litige */}
        {showDisputeForm && canDispute && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              Décrire le problème
            </div>
            <Textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Expliquez en détail le problème rencontré avec le projet livré..."
              rows={4}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateDispute}
                disabled={isLoading || !disputeReason.trim()}
                size="sm"
                variant="destructive"
                className="flex-1"
              >
                Créer le litige
              </Button>
              <Button
                onClick={() => {
                  setShowDisputeForm(false);
                  setDisputeReason('');
                }}
                size="sm"
                variant="outline"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Statut contesté */}
        {currentStatus === 'contested' && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Litige en cours
                </p>
                <p className="text-xs text-muted-foreground">
                  Notre équipe examine actuellement le litige. Vous serez notifié de la décision sous 48h.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statut libéré */}
        {currentStatus === 'released' && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-success mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Fonds libérés
                </p>
                <p className="text-xs text-muted-foreground">
                  {userRole === 'freelancer'
                    ? 'Les fonds ont été transférés sur votre compte.'
                    : 'Les fonds ont été libérés au freelance.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
