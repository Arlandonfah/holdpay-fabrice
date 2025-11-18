import { useState } from 'react';
import { revolutPayService, RevolutPayService, RevolutPaymentRequest, RevolutPaymentResponse, REVOLUT_CONFIG } from '@/lib/revolut-pay';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export function useRevolutPay() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    
     //Création d'un paiement Revolut et mise à jour de la base de données
     
    const createPayment = async (
        paymentLinkId: string,
        paymentData: {
            amount: number;
            currency: string;
            description: string;
            clientEmail?: string;
            clientName?: string;
        }
    ): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);

            //Création d'ordre Revolut
            const revolutRequest: RevolutPaymentRequest = {
                amount: paymentData.amount,
                currency: paymentData.currency,
                description: paymentData.description,
                merchant_order_ext_ref: paymentLinkId,
                email: paymentData.clientEmail,
                capture_mode: 'AUTOMATIC'
            };

            const revolutOrder = await revolutPayService.createPaymentOrder(revolutRequest);

            //Sauvegarde des détails du paiement dans Supabase
            const { error: supabaseError } = await (supabase as any)
                .from('payment_transactions')
                .insert([{
                    payment_link_id: paymentLinkId,
                    revolut_order_id: revolutOrder.id,
                    amount: paymentData.amount,
                    currency: paymentData.currency,
                    status: 'pending',
                    provider: 'revolut',
                    provider_data: revolutOrder,
                    created_at: new Date().toISOString()
                }]);

            if (supabaseError) {
                console.error('Erreur Supabase:', supabaseError);
                throw new Error('Erreur lors de la sauvegarde du paiement');
            }

            // Mise à jour du statut du payment link
            const { error: updateError } = await (supabase as any)
                .from('payments')
                .update({
                    status: 'processing',
                    revolut_order_id: revolutOrder.id
                })
                .eq('id', paymentLinkId);

            if (updateError) {
                console.error('Erreur mise à jour payment link:', updateError);
            }

            toast({
                title: "Paiement initié",
                description: "Redirection vers Revolut Pay..."
            });

            return revolutOrder.checkout.url;
        } catch (error: any) {
            console.error('Erreur création paiement Revolut:', error);
            setError(error.message || 'Erreur lors de la création du paiement');

            toast({
                title: "Erreur",
                description: error.message || 'Impossible de créer le paiement',
                variant: "destructive"
            });

            return null;
        } finally {
            setLoading(false);
        }
    };

    
     //Vérification du statut d'un paiement Revolut
     
    const checkPaymentStatus = async (revolutOrderId: string): Promise<RevolutPaymentResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            // En mode démo, simulation d'une réponse de succès
            if (REVOLUT_CONFIG.isDemo || revolutOrderId.startsWith('demo_order_')) {
                console.log('Mode DEMO - Simulation du statut de paiement:', revolutOrderId);

                const demoOrder: RevolutPaymentResponse = {
                    id: revolutOrderId,
                    type: 'ORDER',
                    state: 'COMPLETED',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    completed_at: new Date().toISOString(),
                    amount: 0, // Sera mis à jour par les données réelles
                    currency: 'EUR',
                    order_id: revolutOrderId,
                    checkout: {
                        url: ''
                    }
                };

                // Mise à jour du statut dans la base de données
                await updatePaymentStatus(revolutOrderId, 'COMPLETED', demoOrder);

                return demoOrder;
            }

            const order = await revolutPayService.getOrder(revolutOrderId);

            // Mise à jour de statut dans la base de données
            await updatePaymentStatus(revolutOrderId, order.state, order);

            return order;
        } catch (error: any) {
            console.error('Erreur vérification statut:', error);
            setError(error.message || 'Erreur lors de la vérification du statut');
            return null;
        } finally {
            setLoading(false);
        }
    };

    
     //Mise à jour du statut du paiement dans Supabase
     
    const updatePaymentStatus = async (
        revolutOrderId: string,
        revolutStatus: string,
        revolutData?: any
    ) => {
        try {
            const internalStatus = RevolutPayService.mapRevolutStatusToInternal(revolutStatus);

            console.log('🔄 Mise à jour du statut:', {
                revolutOrderId,
                revolutStatus,
                internalStatus
            });

            // Récupération de la transaction pour obtenir le payment_link_id
            const { data: transaction, error: getTransactionError } = await (supabase as any)
                .from('payment_transactions')
                .select('payment_link_id')
                .eq('revolut_order_id', revolutOrderId)
                .single();

            console.log('🔍 Recherche transaction:', {
                revolutOrderId,
                transaction,
                error: getTransactionError
            });

            if (getTransactionError) {
                console.error('❌ Erreur récupération transaction:', getTransactionError);
                console.log('🔄 Tentative de mise à jour directe par revolut_order_id');
            }

            // Mise à jour de la transaction
            const { error: transactionError } = await (supabase as any)
                .from('payment_transactions')
                .update({
                    status: internalStatus,
                    provider_data: revolutData,
                    ...(internalStatus === 'paid' && { completed_at: new Date().toISOString() })
                })
                .eq('revolut_order_id', revolutOrderId);

            if (transactionError) {
                console.error('Erreur mise à jour transaction:', transactionError);
            } else {
                console.log('✅ Transaction mise à jour avec succès');
            }

            // Mise à jour du payment link
            let paymentUpdateResult;

            if (transaction?.payment_link_id) {
                console.log('🎯 Mise à jour par payment_link_id:', transaction.payment_link_id);
                // Mise à jour par payment_link_id (plus fiable)
                paymentUpdateResult = await (supabase as any)
                    .from('payments')
                    .update({
                        status: internalStatus,
                        revolut_order_id: revolutOrderId,
                        payment_provider: 'revolut',
                        ...(internalStatus === 'paid' && { paid_at: new Date().toISOString() })
                    })
                    .eq('id', transaction.payment_link_id);
            } else {
                console.log('🔄 Fallback: mise à jour par revolut_order_id:', revolutOrderId);
                // Fallback: mise à jour par revolut_order_id
                paymentUpdateResult = await (supabase as any)
                    .from('payments')
                    .update({
                        status: internalStatus,
                        revolut_order_id: revolutOrderId,
                        payment_provider: 'revolut',
                        ...(internalStatus === 'paid' && { paid_at: new Date().toISOString() })
                    })
                    .eq('revolut_order_id', revolutOrderId);
            }

            console.log('📊 Résultat mise à jour payment:', paymentUpdateResult);

            if (paymentUpdateResult && paymentUpdateResult.error) {
                console.error('Erreur mise à jour payment:', paymentUpdateResult.error);

                // Dernière tentative : rechercher par URL et mise à jour
                console.log('🚨 Dernière tentative de mise à jour...');
                const { data: allPayments } = await (supabase as any)
                    .from('payments')
                    .select('*')
                    .eq('revolut_order_id', revolutOrderId);

                console.log('🔍 Tous les paiements avec cet order_id:', allPayments);
            } else {
                console.log('✅ Lien de paiement mis à jour avec succès');
                console.log('📊 Données mises à jour:', paymentUpdateResult?.data);
            }

            return internalStatus;
        } catch (error) {
            console.error('Erreur mise à jour statut:', error);
            throw error;
        }
    };

    
     //Traitement d'un webhook Revolut
     
    const handleWebhook = async (webhookData: any) => {
        try {
            const { event, data } = webhookData;

            if (event === 'ORDER_COMPLETED' || event === 'ORDER_FAILED' || event === 'ORDER_CANCELLED') {
                await updatePaymentStatus(data.id, data.state, data);

                toast({
                    title: "Statut mis à jour",
                    description: `Paiement ${data.state.toLowerCase()}`,
                    variant: data.state === 'COMPLETED' ? 'default' : 'destructive'
                });
            }
        } catch (error) {
            console.error('Erreur traitement webhook:', error);
        }
    };

    return {
        createPayment,
        checkPaymentStatus,
        updatePaymentStatus,
        handleWebhook,
        loading,
        error
    };
}
