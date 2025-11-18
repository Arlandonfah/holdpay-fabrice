import { PaymentStatus, PaymentStatusHistory, PaymentDispute } from '@/types/payment';

export class PaymentStatusService {
 
  private allowedTransitions: Record<PaymentStatus, PaymentStatus[]> = {
    pending: ['paid', 'expired'],
    paid: ['delivered', 'contested', 'refunded'],
    delivered: ['released', 'contested'],
    released: [],
    contested: ['released', 'refunded'],
    refunded: [],
    expired: [],
  };

  canTransition(currentStatus: PaymentStatus, newStatus: PaymentStatus): boolean {
    return this.allowedTransitions[currentStatus]?.includes(newStatus) || false;
  }

  getAvailableTransitions(currentStatus: PaymentStatus): PaymentStatus[] {
    return this.allowedTransitions[currentStatus] || [];
  }

  async updatePaymentStatus(
    paymentId: string,
    newStatus: PaymentStatus,
    triggeredBy: 'system' | 'freelancer' | 'client' | 'admin',
    note?: string
  ): Promise<PaymentStatusHistory> {
    try {

      const historyEntry: PaymentStatusHistory = {
        id: `history_${Date.now()}`,
        paymentId,
        status: newStatus,
        timestamp: new Date().toISOString(),
        note,
        triggeredBy,
      };

      
      console.log('Updating payment status:', historyEntry);

      return historyEntry;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  
  async getPaymentHistory(paymentId: string): Promise<PaymentStatusHistory[]> {
    try {
      return [
        {
          id: '1',
          paymentId,
          status: 'pending',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          triggeredBy: 'system',
          note: 'Lien de paiement créé',
        },
        {
          id: '2',
          paymentId,
          status: 'paid',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          triggeredBy: 'client',
          note: 'Paiement effectué via Revolut',
        },
      ];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  async markAsDelivered(
    paymentId: string,
    freelancerId: string,
    deliveryNote?: string
  ): Promise<void> {
    try {
      await this.updatePaymentStatus(
        paymentId,
        'delivered',
        'freelancer',
        deliveryNote || 'Projet livré par le freelance'
      );


      console.log('Sending delivery notification to client');
    } catch (error) {
      console.error('Error marking as delivered:', error);
      throw error;
    }
  }

  async releaseFunds(
    paymentId: string,
    triggeredBy: 'system' | 'client' | 'admin',
    note?: string
  ): Promise<void> {
    try {
      await this.updatePaymentStatus(
        paymentId,
        'released',
        triggeredBy,
        note || 'Fonds libérés'
      );


      console.log('Initiating fund transfer to freelancer');
    } catch (error) {
      console.error('Error releasing funds:', error);
      throw error;
    }
  }

  async createDispute(
    paymentId: string,
    reason: string,
    description: string,
    evidence?: string[]
  ): Promise<PaymentDispute> {
    try {
      const dispute: PaymentDispute = {
        id: `dispute_${Date.now()}`,
        paymentId,
        reason,
        description,
        createdAt: new Date().toISOString(),
        evidence,
      };

      await this.updatePaymentStatus(
        paymentId,
        'contested',
        'client',
        `Litige créé: ${reason}`
      );

      console.log('Dispute created:', dispute);
      return dispute;
    } catch (error) {
      console.error('Error creating dispute:', error);
      throw error;
    }
  }

  async resolveDispute(
    disputeId: string,
    resolution: 'refund' | 'release' | 'partial_refund',
    amount?: number
  ): Promise<void> {
    try {
      console.log('Resolving dispute:', { disputeId, resolution, amount });


    } catch (error) {
      console.error('Error resolving dispute:', error);
      throw error;
    }
  }

  shouldAutoRelease(deliveredAt: string, autoReleaseDays: number = 5): boolean {
    const deliveryDate = new Date(deliveredAt);
    const now = new Date();
    const daysSinceDelivery = (now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceDelivery >= autoReleaseDays;
  }

  getStatusLabel(status: PaymentStatus): string {
    const labels: Record<PaymentStatus, string> = {
      pending: 'En attente',
      paid: 'Payé',
      delivered: 'Livré',
      released: 'Libéré',
      contested: 'Contesté',
      refunded: 'Remboursé',
      expired: 'Expiré',
    };
    return labels[status];
  }

  getStatusColor(status: PaymentStatus): string {
    const colors: Record<PaymentStatus, string> = {
      pending: 'warning',
      paid: 'success',
      delivered: 'primary',
      released: 'success',
      contested: 'destructive',
      refunded: 'secondary',
      expired: 'destructive',
    };
    return colors[status];
  }
}

export const paymentStatusService = new PaymentStatusService();
