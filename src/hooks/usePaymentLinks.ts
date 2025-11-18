import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface PaymentLink {
    id: string;
    clientName: string;
    projectName: string;
    amount: number;
    status: 'pending' | 'paid' | 'delivered' | 'released' | 'expired';
    createdAt: string;
    expiresAt: string;
    pdfUrl?: string;
    linkUrl: string;
    freelancer_id: string;
    client_email?: string;
}

export function usePaymentLinks() {
    const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthContext();

    const fetchPaymentLinks = async () => {
        if (!user) {
            setPaymentLinks([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Récupération des liens de paiement de l'utilisateur connecté
            const { data, error: supabaseError } = await (supabase as any)
                .from('payments')
                .select('*')
                .eq('freelancer_id', user.id)
                .order('created_at', { ascending: false });

            if (supabaseError) {
                console.error('Erreur Supabase:', supabaseError);
                setError(`Erreur lors du chargement: ${supabaseError.message}`);
                return;
            }

            // Transformatio des données pour correspondre à l'interface PaymentLink
            const transformedData: PaymentLink[] = (data || []).map((item: any) => ({
                id: item.id,
                clientName: item.client_name,
                projectName: item.project_name,
                amount: item.amount,
                status: item.status,
                createdAt: item.created_at,
                expiresAt: item.expires_at,
                pdfUrl: item.pdf_url,
                linkUrl: item.link_url,
                freelancer_id: item.freelancer_id,
                client_email: item.client_email
            }));

            setPaymentLinks(transformedData);
            console.log('Liens de paiement récupérés:', transformedData);
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            setError('Une erreur est survenue lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentLinks();
    }, [user]);

    const refetch = () => {
        fetchPaymentLinks();
    };

    return {
        paymentLinks,
        loading,
        error,
        refetch
    };
}
