import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package } from "lucide-react";

interface DeliverButtonProps {
  paymentLinkId: string;
  paymentLink: {
    status: string;
    freelancer_id?: string;
    client_email?: string;
    client_name?: string;
    project_name?: string;
    link_url?: string;
  };
  currentUserId?: string;
  refetch?: () => void;
}

export function DeliverButton({ 
  paymentLinkId, 
  paymentLink, 
  currentUserId,
  refetch 
}: DeliverButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // N'afficher le bouton que si :
  // 1. L'utilisateur est connecté
  // 2. C'est le freelance du projet
  // 3. Le statut est 'paid'
  const shouldShowButton = 
    currentUserId && 
    paymentLink.freelancer_id === currentUserId && 
    paymentLink.status === 'paid';

  if (!shouldShowButton) {
    return null;
  }

  // Fonction pour notifier le client par email
  const notifyClientByEmail = async () => {
    if (!paymentLink.client_email) {
      console.warn('Aucun email client disponible pour la notification');
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-delivery-notification', {
        body: {
          to: paymentLink.client_email,
          clientName: paymentLink.client_name || 'Client',
          projectName: paymentLink.project_name || 'Projet',
          paymentLinkUrl: paymentLink.link_url || ''
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email envoyé au client avec succès",
        description: "Le client a été notifié de la livraison",
        variant: "default"
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      toast({
        title: "Impossible d'envoyer l'email pour l'instant",
        description: "La livraison a été confirmée mais l'email n'a pas pu être envoyé",
        variant: "destructive"
      });
    }
  };

  const handleDeliver = async () => {
    setIsLoading(true);
    
    try {
      // Utilisation temporaire de RPC pour contourner les types manquants
      const { error } = await supabase.rpc('update_payment_link_status', {
        payment_link_id: paymentLinkId,
        new_status: 'delivered'
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Livraison confirmée",
        description: "Projet marqué comme livré avec succès",
        variant: "default"
      });

      // Envoyer notification email au client
      await notifyClientByEmail();

      // Mettre à jour le dashboard
      refetch?.();
      
    } catch (error) {
      console.error('Erreur lors de la livraison:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer le projet comme livré. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDeliver}
      disabled={isLoading}
      className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
      size="lg"
    >
      <Package className="h-4 w-4 mr-2" />
      {isLoading ? "Livraison..." : "Livrer le projet"}
    </Button>
  );
}