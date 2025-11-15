import { RevolutOrder, RevolutOrderResponse } from '@/types/payment';

// Configuration Revolut
const REVOLUT_API_URL = import.meta.env.VITE_REVOLUT_API_URL || 'https://merchant.revolut.com/api/1.0';
const REVOLUT_API_KEY = import.meta.env.VITE_REVOLUT_API_KEY || '';

export class RevolutPayService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = REVOLUT_API_KEY;
    this.apiUrl = REVOLUT_API_URL;
  }

  /**
   * Créer un ordre de paiement Revolut
   */
  async createOrder(params: {
    amount: number;
    currency: string;
    description: string;
    merchantOrderExtRef: string;
    customerEmail?: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<RevolutOrderResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount: Math.round(params.amount * 100), // Convertir en centimes
          currency: params.currency.toUpperCase(),
          description: params.description,
          merchant_order_ext_ref: params.merchantOrderExtRef,
          customer_email: params.customerEmail,
          settlement_currency: params.currency.toUpperCase(),
          redirect_urls: {
            success: params.successUrl,
            cancel: params.cancelUrl,
            failure: params.cancelUrl,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Revolut API Error: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        publicId: data.public_id,
        checkoutUrl: data.checkout_url,
        state: data.state,
      };
    } catch (error) {
      console.error('Error creating Revolut order:', error);
      throw error;
    }
  }

  /**
   * 
   */
  async getOrder(orderId: string): Promise<RevolutOrder> {
    try {
      const response = await fetch(`${this.apiUrl}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        publicId: data.public_id,
        type: data.type,
        state: data.state,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        completedAt: data.completed_at,
        amount: data.amount / 100, // Convertir de centimes en euros
        currency: data.currency,
        description: data.description,
        merchantOrderExtRef: data.merchant_order_ext_ref,
        checkoutUrl: data.checkout_url,
      };
    } catch (error) {
      console.error('Error fetching Revolut order:', error);
      throw error;
    }
  }

  /**
   * 
   */
  async cancelOrder(orderId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel order: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error cancelling Revolut order:', error);
      throw error;
    }
  }

 
  async captureOrder(orderId: string, amount?: number): Promise<void> {
    try {
      const body = amount ? { amount: Math.round(amount * 100) } : {};
      
      const response = await fetch(`${this.apiUrl}/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to capture order: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error capturing Revolut order:', error);
      throw error;
    }
  }

  /**
   * Rembourser un paiement
   */
  async refundOrder(orderId: string, amount?: number, reason?: string): Promise<void> {
    try {
      const body: any = {};
      if (amount) body.amount = Math.round(amount * 100);
      if (reason) body.description = reason;

      const response = await fetch(`${this.apiUrl}/orders/${orderId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to refund order: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error refunding Revolut order:', error);
      throw error;
    }
  }

  
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    
    try {
      
      return true;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }
}

// Export singleton
export const revolutPayService = new RevolutPayService();
