# Mini Wallet Sylorion - API Documentation

## Introduction
Mini Wallet Sylorion est une API permettant la gestion des utilisateurs et de leurs comptes bancaires, incluant les opérations de dépôt et de retrait d'argent.  L'accès aux routes sécurisées nécessite une authentification via JWT et une protection CSRF (XSRF-TOKEN).

## Installation
1. Clonez le projet :
   ```sh
   git clone https://github.com/sylorion/mini-wallet-one-day.git
   ```
2. Installez les dépendances :
   ```sh
   npm install
   ```
3. Configurez les variables d'environnement en créant un fichier `.env` :
   ```env
   PORT=3000
   JWT_SECRET=votre_secret
   DATABASE_URL=votre_url_prisma
   ```
4. Démarrez le serveur :
   ```sh
   npm start
   ```


## Authentification & Sécurité des Tokens
### 1️. Obtention du Token de Connexion & du XSRF-TOKEN
- Endpoint : `POST /api/auth/login`
- Corps de la requête :
  ```json
  {
      "email": "user@example.com",
      "password": "password123"
  }
  ```
- Réponse :
  ```json
  {
      "token": "eyJhbGciOiJI...",  // JWT à inclure dans Authorization
      "xsrfToken": "abc123"  // XSRF-TOKEN à inclure dans X-XSRF-TOKEN
  }
  ```
- **Le JWT est stocké en cookie sécurisé (HttpOnly, Secure, SameSite=Strict)**.

### 2️. Utilisation des Tokens
Chaque requête sécurisée doit inclure :
- **JWT** dans l’en-tête `Authorization: Bearer <token>`
- **XSRF-TOKEN** dans `X-XSRF-TOKEN: <xsrfToken>`

---

## Routes de l'API
### Utilisateurs (`/api/users`)

#### Créer un utilisateur
- **POST** `/api/users`
- **Description** : Crée un nouvel utilisateur.
- **Corps de la requête (JSON)** :
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "motdepasse"
  }
  ```
- **Réponses** :
  - `200` : Utilisateur créé avec succès.
  - `400` : Champs obligatoires manquants.
  - `409` : Utilisateur existant.
  - `500` : Erreur serveur.

#### Connexion d'un utilisateur
- **POST** `/api/users/auth/login`
- **Description** : Vérifie les identifiants et génère un token JWT.
- **Corps de la requête (JSON)** :
  ```json
  {
    "email": "john@example.com",
    "password": "motdepasse"
  }
  ```
- **Réponses** :
  - `200` : Connexion réussie, token JWT généré.
  - `400` : Identifiants invalides.
  - `404` : Utilisateur introuvable.

### Comptes (`/api/accounts`)

#### Créer un compte
- **POST** `/api/accounts`
- **Description** : Crée un compte bancaire pour un utilisateur.
- **Sécurisé** : Oui (JWT requis).
- **Corps de la requête (JSON)** :
  ```json
  {
    "userId": 1
  }
  ```
- **Réponses** :
  - `200` : Compte créé avec succès.
  - `401` : Non autorisé.
  - `404` : Utilisateur introuvable.

#### Dépôt d'argent
- **POST** `/api/accounts/{id}/deposit`
- **Description** : Dépose de l'argent sur un compte.
- **Paramètres** :
  - `id` : ID du compte.
- **Corps de la requête (JSON)** :
  ```json
  {
    "amount": 100
  }
  ```
- **Réponses** :
  - `200` : Dépôt réussi.
  - `400` : Montant invalide.
  - `404` : Compte introuvable.

#### Retrait d'argent
- **POST** `/api/accounts/{id}/withdraw`
- **Description** : Retire de l'argent d'un compte.
- **Sécurisé** : Oui (JWT requis).
- **Paramètres** :
  - `id` : ID du compte.
- **Corps de la requête (JSON)** :
  ```json
  {
    "amount": 50
  }
  ```
- **Réponses** :
  - `200` : Retrait réussi.
  - `400` : Fonds insuffisants ou montant invalide.
  - `401` : Non autorisé.
  - `404` : Compte introuvable.

#### Historique des transactions
- **GET** `/api/accounts/{id}`
- **Description** : Récupère les détails du compte et l'historique des transactions.
- **Sécurisé** : Oui (JWT requis).
- **Paramètres** :
  - `id` : ID du compte.
- **Réponses** :
  - `200` : Détails du compte récupérés avec succès.
  - `401` : Non autorisé.
  - `404` : Compte introuvable.

## Documentation Swagger
La documentation interactive est disponible à l'adresse suivante après démarrage du serveur :
```
http://localhost:3000/api-docs
```

## Sécurité
- **Rate Limiting** : Limite le nombre de requêtes pour éviter les abus.
- **Helmet** : Protège contre les attaques XSS.
- **CSRF Protection** : Sécurise les requêtes.
- **JWT** : Gère l'authentification.

## Licence
MIT

