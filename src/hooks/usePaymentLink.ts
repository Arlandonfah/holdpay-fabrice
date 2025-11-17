import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { PaymentLink } from './usePaymentLinks';

export function usePaymentLink(id: string) {
    const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthContext();

    const fetchPaymentLink = async () => {
        if (!user || !id) {
            setPaymentLink(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Récupérer le lien de paiement spécifique
            const { data, error: supabaseError } = await (supabase as any)
                .from('payments')
                .select('*')
                .eq('id', id)
                .eq('freelancer_id', user.id) // Sécurité : seulement ses propres liens
                .single();

            if (supabaseError) {
                console.error('Erreur Supabase:', supabaseError);
                setError(`Erreur lors du chargement: ${supabaseError.message}`);
                return;
            }

            if (!data) {
                setError('Lien de paiement non trouvé');
                return;
            }

            // Transformer les données pour correspondre à l'interface PaymentLink
            const transformedData: PaymentLink = {
                id: data.id,
                clientName: data.client_name,
                projectName: data.project_name,
                amount: data.amount,
                status: data.status,
                createdAt: data.created_at,
                expiresAt: data.expires_at,
                pdfUrl: data.pdf_url,
                linkUrl: data.link_url,
                freelancer_id: data.freelancer_id,
                client_email: data.client_email
            };

            setPaymentLink(transformedData);
            console.log('Lien de paiement récupéré:', transformedData);
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            setError('Une erreur est survenue lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentLink();
    }, [user, id]);

    const refetch = () => {
        fetchPaymentLink();
    };

    return {
        paymentLink,
        loading,
        error,
        refetch
    };
}
