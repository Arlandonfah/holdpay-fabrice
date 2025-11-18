
// Configuration Revolut Pay
export const REVOLUT_CONFIG = {
    // Mode sandbox pour les tests
    apiUrl: 'https://sandbox-merchant.revolut.com/api/1.0',
    publicKey: import.meta.env.VITE_REVOLUT_PUBLIC_KEY || 'pk_test_demo_key_for_development',
    secretKey: import.meta.env.VITE_REVOLUT_SECRET_KEY || 'sk_test_demo_key_for_development',
    webhookSecret: import.meta.env.VITE_REVOLUT_WEBHOOK_SECRET || 'whsec_test_demo_webhook_secret',
    mode: 'sandbox' as 'sandbox' | 'live',
    // Mode simulation pour les tests sans vraies clés
    isDemo: import.meta.env.VITE_REVOLUT_PUBLIC_KEY?.includes('demo') || false
};

// Types pour Revolut Pay
export interface RevolutPaymentRequest {
    amount: number;
    currency: string;
    capture_mode?: 'AUTOMATIC' | 'MANUAL';
    merchant_order_ext_ref?: string;
    description?: string;
    settlement_currency?: string;
    merchant_customer_ext_ref?: string;
    email?: string;
    phone?: string;
    shipping_address?: {
        country_code: string;
        region: string;
        city: string;
        street_line_1: string;
        street_line_2?: string;
        postcode: string;
    };
}

export interface RevolutPaymentResponse {
    id: string;
    type: string;
    state: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
    created_at: string;
    updated_at: string;
    completed_at?: string;
    amount: number;
    currency: string;
    description?: string;
    merchant_order_ext_ref?: string;
    order_id: string;
    checkout: {
        url: string;
    };
}

export interface RevolutWebhookEvent {
    event: string;
    timestamp: string;
    data: {
        id: string;
        type: string;
        state: string;
        amount: number;
        currency: string;
        merchant_order_ext_ref?: string;
        order_id: string;
        created_at: string;
        updated_at: string;
        completed_at?: string;
    };
}

// Classe pour gérer les paiements Revolut
export class RevolutPayService {
    private apiUrl: string;
    private secretKey: string;

    constructor() {
        this.apiUrl = REVOLUT_CONFIG.apiUrl;
        this.secretKey = REVOLUT_CONFIG.secretKey;
    }

    
    //Création d'ordre de paiement Revolut
    async createPaymentOrder(request: RevolutPaymentRequest): Promise<RevolutPaymentResponse> {
        // Mode simulation pour les tests
        if (REVOLUT_CONFIG.isDemo) {
            return this.createDemoPaymentOrder(request);
        }

        try {
            const response = await fetch(`${this.apiUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.secretKey}`,
                    'Revolut-Api-Version': '2023-09-01'
                },
                body: JSON.stringify({
                    amount: Math.round(request.amount * 100), 
                    currency: request.currency,
                    capture_mode: request.capture_mode || 'AUTOMATIC',
                    merchant_order_ext_ref: request.merchant_order_ext_ref,
                    description: request.description,
                    settlement_currency: request.settlement_currency || request.currency,
                    merchant_customer_ext_ref: request.merchant_customer_ext_ref,
                    email: request.email,
                    phone: request.phone,
                    shipping_address: request.shipping_address
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Revolut API Error: ${errorData.message || response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur lors de la création de l\'ordre Revolut:', error);
            throw error;
        }
    }

    
    //Création d'ordre de paiement de démonstration
    private createDemoPaymentOrder(request: RevolutPaymentRequest): Promise<RevolutPaymentResponse> {
        const orderId = `demo_order_${Date.now()}`;
        const demoResponse: RevolutPaymentResponse = {
            id: orderId,
            type: 'ORDER',
            state: 'PENDING',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            amount: request.amount,
            currency: request.currency,
            description: request.description,
            merchant_order_ext_ref: request.merchant_order_ext_ref,
            order_id: orderId,
            checkout: {
                // URL de simulation qui redirige vers la page de succès après 3 secondes
                url: `${window.location.origin}/payment/demo-checkout?order_id=${orderId}&amount=${request.amount}&currency=${request.currency}`
            }
        };

        console.log('Mode DEMO Revolut Pay activé - Paiement simulé:', demoResponse);
        return Promise.resolve(demoResponse);
    }

    
    //Récupération des détails d'un ordre 
    async getOrder(orderId: string): Promise<RevolutPaymentResponse> {
        // Mode simulation pour les tests
        if (REVOLUT_CONFIG.isDemo || orderId.startsWith('demo_order_')) {
            console.log('🎭 Mode DEMO - Récupération simulée de l\'ordre:', orderId);

            const demoOrder: RevolutPaymentResponse = {
                id: orderId,
                type: 'ORDER',
                state: 'COMPLETED',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                completed_at: new Date().toISOString(),
                amount: 0, // Sera mis à jour par les données réelles
                currency: 'EUR',
                order_id: orderId,
                checkout: {
                    url: ''
                }
            };

            return Promise.resolve(demoOrder);
        }

        try {
            const response = await fetch(`${this.apiUrl}/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.secretKey}`,
                    'Revolut-Api-Version': '2023-09-01'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Revolut API Error: ${errorData.message || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ordre Revolut:', error);
            throw error;
        }
    }

    
    async capturePayment(orderId: string, amount?: number): Promise<RevolutPaymentResponse> {
        try {
            const body: any = {};
            if (amount) {
                body.amount = Math.round(amount * 100);
            }

            const response = await fetch(`${this.apiUrl}/orders/${orderId}/capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.secretKey}`,
                    'Revolut-Api-Version': '2023-09-01'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Revolut API Error: ${errorData.message || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la capture du paiement Revolut:', error);
            throw error;
        }
    }

    
    //Annuler un paiement
    async cancelPayment(orderId: string): Promise<RevolutPaymentResponse> {
        try {
            const response = await fetch(`${this.apiUrl}/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.secretKey}`,
                    'Revolut-Api-Version': '2023-09-01'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Revolut API Error: ${errorData.message || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de l\'annulation du paiement Revolut:', error);
            throw error;
        }
    }

    
    //Convertion de statut Revolut en statut interne
    static mapRevolutStatusToInternal(revolutStatus: string): 'pending' | 'paid' | 'failed' | 'cancelled' {
        const mapping = {
            'COMPLETED': 'paid',
            'FAILED': 'failed',
            'CANCELLED': 'cancelled',
            'PENDING': 'pending',
            'PROCESSING': 'pending'
        };

        const internalStatus = mapping[revolutStatus as keyof typeof mapping] || 'pending';

        console.log('🔄 Mapping statut Revolut:', {
            revolutStatus,
            internalStatus
        });

        return internalStatus as 'pending' | 'paid' | 'failed' | 'cancelled';
    }
}

// Instance singleton du service
export const revolutPayService = new RevolutPayService();
