# Holdpay – plate‑forme de paiement avec Supabase & Revolut

Projet front-end (Vite + React + TypeScript) pour la démo **Holdpay** : inscription / connexion utilisateur, création de liens de paiement, suivi du statut de paiement et intégration Revolut.

URL de prod Lovable : `https://holdpay-fabrice.lovable.app/`

Email de test si vous n'avez pas besoin de creer:

email: test4@gmail.com

password: test41234

---

## 1. Installation et exécution en local

### 1.1. Prérequis

- **Node.js** ≥ 18
- **npm** (fourni avec Node)
- Un compte **Supabase** (projet créé)
- (Optionnel) Compte **Revolut Merchant** en mode sandbox

### 1.2. Cloner le dépôt

```sh
git clone https://github.com/Arlandonfah/holdpay-fabrice.git
cd holdpay-fabrice
```

### 1.3. Installation des dépendances

```sh
npm install
```

### 1.4. Configuration des variables d’environnement

Copier le fichier d’exemple puis le renseigner :

```sh
cp .env.example .env
```

Dans `.env` :

- **Supabase**

  - `VITE_SUPABASE_URL` : URL du projet Supabase
  - `VITE_SUPABASE_PUBLISHABLE_KEY` : clé `anon` (publique) Supabase
  - `VITE_SUPABASE_PROJECT_ID` : identifiant du projet (ref Supabase)
- **Revolut (sandbox)**

  - `VITE_REVOLUT_PUBLIC_KEY`
  - `VITE_REVOLUT_SECRET_KEY`
  - `VITE_REVOLUT_WEBHOOK_SECRET`
- **URLs de l’application**

  - `VITE_APP_URL` : URL locale (ex. `http://localhost:5173`)
  - `VITE_SUCCESS_URL` : URL de redirection après paiement réussi
  - `VITE_FAILURE_URL` : URL de redirection après échec

### 1.5. Initialiser la base Supabase

Dans le dashboard Supabase (onglet **SQL**), exécuter les scripts du dossier `sql/` dans cet ordre :

- `sql/create_users_table.sql`
- `sql/create_payments_table.sql`
- `sql/create_payment_transactions.sql`
- `sql/add_missing_columns.sql`

Ces scripts créent les tables `users`, `payments`, `payment_transactions` et ajoutent les colonnes / index nécessaires.

### 1.6. Lancer le serveur de développement

```sh
npm run dev
```

Par défaut l’application est accessible sur `http://localhost:5173`.

---

## 2. Utilisation avec Docker

### 2.1. Prérequis

- **Docker** ≥ 20.10
- **Docker Compose** ≥ 2.0

### 2.2. Développement avec Docker Compose

Docker Compose permet de lancer l'application en mode développement avec hot-reload :

```sh
# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables dans .env (voir section 1.4)

# Lancer l'application
docker-compose up

# Ou en arrière-plan
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter l'application
docker-compose down
```

L'application sera accessible sur `http://localhost:8080`.

### 2.3. Production avec Docker

Pour construire et lancer l'application en mode production :

```sh
# Construire l'image Docker
docker build -t holdpay-app .

# Lancer le conteneur (avec les variables d'environnement)
docker run -p 80:80 --env-file .env holdpay-app

# Ou avec des variables spécifiques
docker run -p 80:80 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=your_key \
  holdpay-app
```

L'application sera accessible sur `http://localhost`.

### 2.4. Commandes Docker utiles

```sh
# Reconstruire l'image sans cache
docker-compose build --no-cache

# Voir les conteneurs en cours d'exécution
docker ps

# Accéder au shell d'un conteneur
docker-compose exec web sh

# Supprimer les conteneurs et volumes
docker-compose down -v
```

---

## 3. Scénarios de test


### 2.1. Authentification

- **Inscription**

  - Aller sur `/register`
  - Renseigner prénom, nom, email et mot de passe
  - Un utilisateur est créé dans Supabase Auth et dans la table `users`
  - Si l’option *Confirm email* est activée dans Supabase, confirmer l’email avant de tester la connexion
- **Connexion**

  - Aller sur `/login`
  - Se connecter avec l’email / mot de passe créés
  - En cas d’erreur, un toast avec le message Supabase est affiché

### 2.2. Liens de paiement

- Depuis le dashboard, créer un **lien de paiement** (montant, description, etc.)
- Partager / ouvrir le lien côté client (`/client-payment/...`)
- Payer via Revolut sandbox
- Vérifier sur le dashboard que le statut de paiement se met à jour (grâce aux webhooks Revolut et au service `paymentStatusService`)

### 2.3. Vérifier la base de données

Dans Supabase, onglet **Table editor** :

- Table `users` : contient les profils utilisateurs
- Table `payments` : contient les liens de paiement
- Table `payment_transactions` : contient l’historique des tentatives de paiement

---

## 3. Choix techniques principaux

- **Vite + React + TypeScript**

  - Vite pour un dev server rapide et un build optimisé
  - React/TS pour une base moderne, typée et composable
- **Supabase**

  - Authentification (email + mot de passe) via `supabase.auth`
  - Base de données Postgres managée pour stocker `users`, `payments`, `payment_transactions`
  - Intégration via `src/integrations/supabase/client.ts` et types générés dans `src/integrations/supabase/types.ts`
- **Revolut Pay**

  - Intégration côté front via `src/lib/revolut-pay.ts` et `src/hooks/useRevolutPay.ts`
  - Webhook Revolut géré par `src/api/webhooks/revolut.ts`
  - Services métier dans `src/services/revolutPayService.ts` et `src/services/paymentStatusService.ts`
- **UI & Design**

  - **shadcn-ui** et **Tailwind CSS** pour les composants et le styling
  - Composants métiers : `PaymentMethodSelector`, `PaymentStatusManager`, `payment-link-card`, etc.
- **Architecture front-end**

  - `src/pages/` : pages principales (Home, Register, Login, Dashboard, PaymentSuccess/Failure, etc.)
  - `src/hooks/` : hooks métier (`useAuth`, `usePaymentLinks`, `useRevolutPay`…)
  - `src/contexts/AuthContext.tsx` : contexte d’auth partagé
  - `src/services/` : logique d’accès aux APIs et de suivi des paiements

---

## 4. Travailler avec Lovable

### 4.1. Modifier le code via Lovable

- Ouvrir le [projet Lovable](https://lovable.dev/projects/2e10987d-9d5c-4ad9-af37-5502ab006727)
- Modifier le code dans l’éditeur Lovable
- Les modifications sont automatiquement poussées sur ce dépôt GitHub

### 4.2. Travailler en local avec votre IDE

Vous pouvez également suivre les étapes d’installation ci‑dessus, utiliser votre IDE puis pousser vos changements sur GitHub. Lovable les prendra en compte automatiquement.

### 4.3. Déploiement via Lovable

- Ouvrir le projet sur Lovable
- Cliquer sur **Share → Publish** pour publier la dernière version

---

## 5. Domaine personnalisé

Oui, il est possible de connecter un domaine personnalisé.

- Aller dans **Project → Settings → Domains** sur Lovable
- Cliquer sur **Connect a domain** et suivre l’assistant

Plus de détails : [Configurer un domaine personnalisé](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
