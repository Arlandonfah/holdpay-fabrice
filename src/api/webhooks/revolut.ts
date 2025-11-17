/**
 * Endpoint pour les webhooks Revolut Pay
 * Ce fichier devrait être déployé comme une fonction serverless ou API endpoint
 */

import { supabase } from '@/integrations/supabase/client';
import { REVOLUT_CONFIG, RevolutWebhookEvent, revolutPayService } from '@/lib/revolut-pay';

// Fonction pour vérifier la signature du webhook (sécurité)
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Implémentation de la vérification de signature Revolut
    // Cette fonction devrait utiliser HMAC-SHA256 pour vérifier la signature
    try {
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        return signature === `sha256=${expectedSignature}`;
    } catch (error) {
        console.error('Erreur vérification signature:', error);
        return false;
    }
}

// Handler principal pour les webhooks Revolut
export async function handleRevolutWebhook(request: Request): Promise<Response> {
    try {
        const signature = request.headers.get('revolut-signature');
        const payload = await request.text();

        // Vérifier la signature du webhook
        if (!signature || !verifyWebhookSignature(payload, signature, REVOLUT_CONFIG.webhookSecret)) {
            console.error('Signature webhook invalide');
            return new Response('Unauthorized', { status: 401 });
        }

        const webhookData: RevolutWebhookEvent = JSON.parse(payload);
        console.log('Webhook Revolut reçu:', webhookData);

        // Traiter l'événement selon son type
        switch (webhookData.event) {
            case 'ORDER_COMPLETED':
                await handleOrderCompleted(webhookData);
                break;

            case 'ORDER_FAILED':
                await handleOrderFailed(webhookData);
                break;

            case 'ORDER_CANCELLED':
                await handleOrderCancelled(webhookData);
                break;

            case 'ORDER_AUTHORISED':
                await handleOrderAuthorised(webhookData);
                break;

            default:
                console.log('Événement webhook non géré:', webhookData.event);
        }

        return new Response('OK', { status: 200 });
    } catch (error) {
        console.error('Erreur traitement webhook Revolut:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

// Gérer la completion d'un ordre (paiement réussi)
async function handleOrderCompleted(webhookData: RevolutWebhookEvent) {
    const { data } = webhookData;

    try {
        // 1. Mettre à jour la transaction
        const { error: transactionError } = await (supabase as any)
            .from('payment_transactions')
            .update({
                status: 'paid',
                provider_data: data,
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('revolut_order_id', data.id);

        if (transactionError) {
            console.error('Erreur mise à jour transaction:', transactionError);
        }

        // 2. Mettre à jour le payment link
        const { error: paymentError } = await (supabase as any)
            .from('payments')
            .update({
                status: 'paid',
                paid_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('revolut_order_id', data.id);

        if (paymentError) {
            console.error('Erreur mise à jour payment:', paymentError);
        }

        // 3. Envoyer une notification (optionnel)
        await sendPaymentNotification(data.merchant_order_ext_ref, 'completed');

        console.log('Paiement complété avec succès:', data.id);
    } catch (error) {
        console.error('Erreur traitement ORDER_COMPLETED:', error);
    }
}

// Gérer l'échec d'un ordre
async function handleOrderFailed(webhookData: RevolutWebhookEvent) {
    const { data } = webhookData;

    try {
        // 1. Mettre à jour la transaction
        const { error: transactionError } = await (supabase as any)
            .from('payment_transactions')
            .update({
                status: 'failed',
                provider_data: data,
                updated_at: new Date().toISOString()
            })
            .eq('revolut_order_id', data.id);

        if (transactionError) {
            console.error('Erreur mise à jour transaction:', transactionError);
        }

        // 2. Remettre le payment link en pending
        const { error: paymentError } = await (supabase as any)
            .from('payments')
            .update({
                status: 'pending',
                updated_at: new Date().toISOString()
            })
            .eq('revolut_order_id', data.id);

        if (paymentError) {
            console.error('Erreur mise à jour payment:', paymentError);
        }

        // 3. Envoyer une notification d'échec
        await sendPaymentNotification(data.merchant_order_ext_ref, 'failed');

        console.log('Paiement échoué:', data.id);
    } catch (error) {
        console.error('Erreur traitement ORDER_FAILED:', error);
    }
}

// Gérer l'annulation d'un ordre
async function handleOrderCancelled(webhookData: RevolutWebhookEvent) {
    const { data } = webhookData;

    try {
        // 1. Mettre à jour la transaction
        const { error: transactionError } = await (supabase as any)
            .from('payment_transactions')
            .update({
                status: 'cancelled',
                provider_data: data,
                updated_at: new Date().toISOString()
            })
            .eq('revolut_order_id', data.id);

        if (transactionError) {
            console.error('Erreur mise à jour transaction:', transactionError);
        }

        // 2. Remettre le payment link en pending
        const { error: paymentError } = await (supabase as any)
            .from('payments')
            .update({
                status: 'pending',
                updated_at: new Date().toISOString()
            })
            .eq('revolut_order_id', data.id);

        if (paymentError) {
            console.error('Erreur mise à jour payment:', paymentError);
        }

        console.log('Paiement annulé:', data.id);
    } catch (error) {
        console.error('Erreur traitement ORDER_CANCELLED:', error);
    }
}

// Gérer l'autorisation d'un ordre (paiement autorisé mais pas encore capturé)
async function handleOrderAuthorised(webhookData: RevolutWebhookEvent) {
    const { data } = webhookData;

    try {
        // Mettre à jour le statut en "processing"
        const { error: transactionError } = await (supabase as any)
            .from('payment_transactions')
            .update({
                status: 'processing',
                provider_data: data,
                updated_at: new Date().toISOString()
            })
            .eq('revolut_order_id', data.id);

        if (transactionError) {
            console.error('Erreur mise à jour transaction:', transactionError);
        }

        const { error: paymentError } = await (supabase as any)
            .from('payments')
            .update({
                status: 'processing',
                updated_at: new Date().toISOString()
            })
            .eq('revolut_order_id', data.id);

        if (paymentError) {
            console.error('Erreur mise à jour payment:', paymentError);
        }

        console.log('Paiement autorisé:', data.id);
    } catch (error) {
        console.error('Erreur traitement ORDER_AUTHORISED:', error);
    }
}

// Envoyer une notification (email, SMS, etc.)
async function sendPaymentNotification(paymentLinkId: string | undefined, status: string) {
    if (!paymentLinkId) return;

    try {
        // Récupérer les détails du payment link
        const { data: paymentLink } = await (supabase as any)
            .from('payments')
            .select('*')
            .eq('id', paymentLinkId)
            .single();

        if (!paymentLink) return;

        // Ici, vous pouvez implémenter l'envoi d'emails ou notifications
        // Par exemple, avec un service comme SendGrid, Mailgun, etc.
        console.log(`Notification à envoyer pour ${paymentLinkId}: ${status}`);

        // Exemple d'implémentation :
        // await sendEmail({
        //   to: paymentLink.client_email,
        //   subject: status === 'completed' ? 'Paiement confirmé' : 'Problème avec votre paiement',
        //   template: status === 'completed' ? 'payment-success' : 'payment-failed',
        //   data: paymentLink
        // });

    } catch (error) {
        console.error('Erreur envoi notification:', error);
    }
}

// Export pour utilisation dans un framework serverless
export default handleRevolutWebhook;
