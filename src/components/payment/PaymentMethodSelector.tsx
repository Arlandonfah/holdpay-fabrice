import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Check } from 'lucide-react';
import { PaymentMethod } from '@/types/payment';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  disabled = false,
}: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: 'stripe' as PaymentMethod,
      name: 'Carte bancaire',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      logo: '/stripe-logo.svg',
      fees: '1.4% + 0.25€',
    },
    {
      id: 'revolut' as PaymentMethod,
      name: 'Revolut Pay',
      description: 'Paiement rapide et sécurisé',
      icon: Wallet,
      logo: '/revolut-logo.svg',
      fees: '1.2%',
      badge: 'Recommandé',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Choisissez votre méthode de paiement
      </h3>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {methods.map((method) => (
          <Card
            key={method.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedMethod === method.id
                ? 'border-primary border-2 bg-primary/5'
                : 'border-border hover:border-primary/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onMethodChange(method.id)}
          >
            <CardContent className="p-6">
              {/* Badge recommandé */}
              {method.badge && selectedMethod !== method.id && (
                <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {method.badge}
                </div>
              )}

              {/* Checkmark si sélectionné */}
              {selectedMethod === method.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}

              <div className="space-y-4">
                {/* Icône et nom */}
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    selectedMethod === method.id
                      ? 'bg-primary/20'
                      : 'bg-muted'
                  }`}>
                    <method.icon className={`h-6 w-6 ${
                      selectedMethod === method.id
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {method.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>

                {/* Frais */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Frais de transaction
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {method.fees}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informations de sécurité */}
      <div className="bg-muted/50 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Check className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 text-sm">
            <p className="font-medium text-foreground mb-1">
              Paiement 100% sécurisé
            </p>
            <p className="text-muted-foreground">
              Vos données bancaires sont cryptées et ne sont jamais stockées sur nos serveurs.
              Tous les paiements sont conformes aux normes PCI DSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
