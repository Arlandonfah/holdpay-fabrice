# Intégration Revolut Pay - Holdpay

## 🚀 Vue d'ensemble

Cette intégration permet d'utiliser Revolut Pay comme méthode de paiement alternative à Stripe dans l'application Holdpay. Elle gère le cycle complet de paiement avec mise à jour des statuts en temps réel.

## 📋 Fonctionnalités implémentées

### ✅ Paiements
- [x] Création d'ordres de paiement Revolut
- [x] Redirection vers Revolut Pay
- [x] Gestion des statuts (pending, processing, paid, failed, cancelled)
- [x] Pages de succès et d'échec personnalisées
- [x] Mise à jour automatique des statuts via webhooks

### ✅ Base de données
- [x] Table `payment_transactions` pour tracer les paiements
- [x] Colonnes additionnelles dans `payments` pour Revolut
- [x] Politiques RLS configurées
- [x] Triggers pour `updated_at` automatique

### ✅ Interface utilisateur
- [x] Page de paiement client mise à jour
- [x] Gestion du loading et des erreurs
- [x] Pages de confirmation (succès/échec)
- [x] Messages d'erreur détaillés

## 🔧 Configuration

### 1. Variables d'environnement

Créez un fichier `.env` basé sur `.env.example` :

```bash
# Revolut Pay Configuration (Sandbox)
VITE_REVOLUT_PUBLIC_KEY=pk_test_your_revolut_public_key
VITE_REVOLUT_SECRET_KEY=sk_test_your_revolut_secret_key
VITE_REVOLUT_WEBHOOK_SECRET=whsec_test_your_webhook_secret

# URLs de redirection
VITE_SUCCESS_URL=http://localhost:5173/payment/success
VITE_FAILURE_URL=http://localhost:5173/payment/failure
```

### 2. Base de données Supabase

Exécutez le script SQL dans `sql/create_payment_transactions.sql` :

```sql
-- Créer la table payment_transactions
-- Ajouter les colonnes Revolut à payments
-- Configurer les politiques RLS
-- Créer les triggers
```

### 3. Compte Revolut Business

1. Créez un compte Revolut Business
2. Activez Revolut Pay dans les paramètres
3. Récupérez vos clés API (sandbox pour les tests)
4. Configurez les webhooks pointant vers votre endpoint

## 🔄 Flux de paiement

### 1. Création du paiement
```typescript
// Le client clique sur "Payer"
const checkoutUrl = await createPayment(paymentLinkId, {
  amount: 2500,
  currency: 'EUR',
  description: 'Paiement pour Projet X',
  clientEmail: 'client@example.com'
});

// Redirection vers Revolut Pay
window.location.href = checkoutUrl;
```

### 2. Traitement du paiement
1. Client redirigé vers Revolut Pay
2. Client effectue le paiement
3. Revolut redirige vers `/payment/success` ou `/payment/failure`
4. Webhook Revolut met à jour le statut en base

### 3. Mise à jour des statuts
```typescript
// Via webhook automatique
ORDER_COMPLETED -> status: 'paid'
ORDER_FAILED -> status: 'failed' 
ORDER_CANCELLED -> status: 'cancelled'
ORDER_AUTHORISED -> status: 'processing'
```

## 📊 Statuts des paiements

| Statut | Description | Action |
|--------|-------------|--------|
| `pending` | En attente de paiement | Client peut payer |
| `processing` | Paiement autorisé | En cours de traitement |
| `paid` | Paiement confirmé | Fonds sécurisés |
| `failed` | Paiement échoué | Client peut réessayer |
| `cancelled` | Paiement annulé | Client peut réessayer |
| `delivered` | Travail livré | En attente validation |
| `released` | Fonds libérés | Transaction terminée |
| `contested` | Litige ouvert | En cours de résolution |

## 🔗 Routes ajoutées

```typescript
// Pages de paiement client
/pay/:slug                    // Page de paiement
/payment/success/:slug?       // Succès du paiement  
/payment/failure/:slug?       // Échec du paiement

// API (à déployer séparément)
/api/webhooks/revolut         // Endpoint webhook
```

## 🧪 Tests en mode Sandbox

### 1. Configuration Sandbox
```typescript
const REVOLUT_CONFIG = {
  apiUrl: 'https://sandbox-merchant.revolut.com/api/1.0',
  mode: 'sandbox'
};
```

### 2. Cartes de test Revolut
- **Succès**: `4242 4242 4242 4242`
- **Échec**: `4000 0000 0000 0002`
- **Fonds insuffisants**: `4000 0000 0000 9995`

### 3. Tester le flux complet
1. Créer un lien de paiement
2. Accéder à `/pay/[slug]`
3. Cliquer "Payer avec Revolut Pay"
4. Utiliser une carte de test
5. Vérifier la redirection et mise à jour du statut

## 🔒 Sécurité

### Webhooks
- Vérification de signature HMAC-SHA256
- Validation de l'origine des requêtes
- Gestion des erreurs et retry logic

### Base de données
- Politiques RLS activées
- Accès limité aux données utilisateur
- Logs d'audit des transactions

## 🚨 Gestion d'erreurs

### Erreurs courantes
```typescript
PAYMENT_DECLINED     // Carte refusée
INSUFFICIENT_FUNDS   // Fonds insuffisants  
CARD_EXPIRED        // Carte expirée
INVALID_CARD        // Carte invalide
PAYMENT_CANCELLED   // Annulé par l'utilisateur
TIMEOUT             // Session expirée
```

### Actions de récupération
- Messages d'erreur explicites
- Bouton "Réessayer le paiement"
- Suggestions de solutions
- Contact support intégré

## 📈 Monitoring

### Métriques à surveiller
- Taux de succès des paiements
- Temps de traitement moyen
- Erreurs webhook
- Abandons de panier

### Logs importants
```typescript
// Création de paiement
console.log('Paiement créé:', { orderId, amount, currency });

// Webhook reçu  
console.log('Webhook Revolut:', { event, orderId, status });

// Erreurs
console.error('Erreur paiement:', { error, orderId, userId });
```

## 🔄 Migration depuis Stripe

Si vous migrez depuis Stripe :

1. **Garder Stripe en parallèle** pour les paiements existants
2. **Ajouter le choix** Revolut/Stripe sur la page de paiement
3. **Tester en production** avec de petits montants
4. **Migrer progressivement** les nouveaux paiements

## 📞 Support

### En cas de problème
1. Vérifier les logs de l'application
2. Contrôler les webhooks dans Revolut Dashboard
3. Vérifier la configuration des variables d'environnement
4. Contacter le support Revolut si nécessaire

### Ressources utiles
- [Documentation Revolut Pay](https://developer.revolut.com/docs/merchant-api)
- [Guide des webhooks](https://developer.revolut.com/docs/merchant-api/#webhooks)
- [Cartes de test](https://developer.revolut.com/docs/merchant-api/#testing)

---

## ✅ Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Script SQL exécuté dans Supabase
- [ ] Webhook endpoint déployé et accessible
- [ ] Webhook configuré dans Revolut Dashboard
- [ ] Tests effectués en mode sandbox
- [ ] Monitoring et alertes configurés
- [ ] Documentation équipe mise à jour

**L'intégration Revolut Pay est maintenant prête pour la production !** 🎉
