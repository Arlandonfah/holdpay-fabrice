// Types pour les statuts de paiement
export type PaymentStatus = 
  | 'pending'      // En attente de paiement
  | 'paid'         // Payé, fonds bloqués
  | 'delivered'    // Projet livré, en attente de validation
  | 'released'     // Fonds libérés au freelance
  | 'contested'    // Litige en cours
  | 'refunded'     // Remboursé au client
  | 'expired';     // Lien expiré

// Types pour les méthodes de paiement
export type PaymentMethod = 'stripe' | 'revolut';

// Interface pour les données de paiement
export interface PaymentData {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  paymentLinkId: string;
}

// Interface pour Revolut Pay Order
export interface RevolutOrder {
  id: string;
  publicId: string;
  type: 'PAYMENT';
  state: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  amount: number;
  currency: string;
  description: string;
  merchantOrderExtRef: string;
  checkoutUrl: string;
}

// Interface pour la réponse de création d'ordre Revolut
export interface RevolutOrderResponse {
  id: string;
  publicId: string;
  checkoutUrl: string;
  state: string;
}

// Interface pour les webhooks Revolut
export interface RevolutWebhookEvent {
  event: 'ORDER_COMPLETED' | 'ORDER_CANCELLED' | 'ORDER_AUTHORISED';
  timestamp: string;
  order: {
    id: string;
    publicId: string;
    state: string;
    amount: number;
    currency: string;
    merchantOrderExtRef: string;
  };
}

// Interface pour l'historique des statuts
export interface PaymentStatusHistory {
  id: string;
  paymentId: string;
  status: PaymentStatus;
  timestamp: string;
  note?: string;
  triggeredBy: 'system' | 'freelancer' | 'client' | 'admin';
}

// Interface pour les litiges
export interface PaymentDispute {
  id: string;
  paymentId: string;
  reason: string;
  description: string;
  createdAt: string;
  resolvedAt?: string;
  resolution?: 'refund' | 'release' | 'partial_refund';
  evidence?: string[];
}
