# Spécification & Référence API — Smart E-Banking

> Documentation exhaustive des points d'accès (endpoints) REST, flux réactifs et protocoles exposés par la plateforme **Smart E-Banking**.

---

## 1. Conventions d'Accès & Passerelle

L'architecture privilégie l'accès centralisé via la **Spring Cloud Gateway (Port 9999)** qui route les requêtes vers les services internes appropriés selon le préfixe du chemin d'URL.

* **URL de base (Gateway Unifiée) :** `http://localhost:9999` (ou IP publique : `http://51.170.134.81:9999`)
* **URL publique chiffrée (Cloudflare) :** `https://instead-pen-contemporary-jackson.trycloudflare.com`
* **Format d'échange :** `application/json` (ou `text/plain` pour les flux de streaming)
* **Configuration CORS :** Activée globalement sur la Gateway (`AllowedOrigins: *`).

### Documentations Interactives OpenAPI / Swagger UI
* **Customer Service :** `http://localhost:8056/swagger-ui/index.html`
* **EBank Service :** `http://localhost:8057/swagger-ui/index.html`
* **EBank Bot :** `http://localhost:8058/swagger-ui/index.html`

---

## 2. Customer Service (Port 8056 / Route Gateway : `/CUSTOMER-SERVICE`)

### 2.1 Lister tous les clients
Récupère l'ensemble des clients bancaires enregistrés.

* **Méthode :** `GET`
* **Chemin Direct :** `/customers`
* **Chemin Gateway :** `/CUSTOMER-SERVICE/customers`
* **Code Succès :** `200 OK`

#### Exemple de Réponse (`200 OK`) :
```json
[
  {
    "id": 1,
    "name": "Mohamed",
    "email": "Mohamed@gmail.com"
  },
  {
    "id": 2,
    "name": "Imane",
    "email": "Imane@gmail.com"
  },
  {
    "id": 3,
    "name": "yassine",
    "email": "yassine@gmail.com"
  }
]
```

---

### 2.2 Récupérer un client par identifiant
Consulte les coordonnées d'un client spécifique.

* **Méthode :** `GET`
* **Chemin Direct :** `/customers/{id}`
* **Chemin Gateway :** `/CUSTOMER-SERVICE/customers/{id}`
* **Paramètre d'URL :** `id` (entier, ex: `1`)
* **Codes Retour :** `200 OK`, `404 Not Found`

#### Exemple de Réponse (`200 OK`) :
```json
{
  "id": 1,
  "name": "Mohamed",
  "email": "Mohamed@gmail.com"
}
```

---

### 2.3 Créer un nouveau client
Enregistre un nouveau titulaire dans la base de données.

* **Méthode :** `POST`
* **Chemin Direct :** `/customers`
* **Chemin Gateway :** `/CUSTOMER-SERVICE/customers`
* **En-tête :** `Content-Type: application/json`
* **Code Succès :** `201 Created`

#### Corps de la Requête (Request Body) :
```json
{
  "name": "Yazid ESSOKTANI",
  "email": "essoktani.yazid@gmail.com"
}
```

---

## 3. EBank Service (Port 8057 / Route Gateway : `/EBANK-SERVICE`)

### 3.1 Lister tous les comptes bancaires
Retourne la liste des comptes bancaires (Courants et Épargne) enrichis des détails de leur titulaire via OpenFeign.

* **Méthode :** `GET`
* **Chemin Direct :** `/accounts`
* **Chemin Gateway :** `/EBANK-SERVICE/accounts`
* **Code Succès :** `200 OK`

#### Exemple de Réponse (`200 OK`) :
```json
[
  {
    "id": "b0e0f0ab-5b6b-4a75-a706-fd1b727c7bdf",
    "createdAt": "2026-11-04T07:38:29.220Z",
    "balance": 12666.45,
    "type": "CURRENT-ACCOUNT",
    "customerId": 1,
    "customer": {
      "id": 1,
      "name": "Mohamed",
      "email": "Mohamed@gmail.com"
    }
  },
  {
    "id": "c1f2e3d4-8877-44aa-99bb-112233445566",
    "createdAt": "2026-11-04T07:38:29.221Z",
    "balance": 45000.00,
    "type": "SAVING-ACCOUNT",
    "customerId": 2,
    "customer": {
      "id": 2,
      "name": "Imane",
      "email": "Imane@gmail.com"
    }
  }
]
```

---

### 3.2 Consulter un compte par identifiant (UUID)
Récupère les informations détaillées d'un compte avec disjoncteur Resilience4j.

* **Méthode :** `GET`
* **Chemin Direct :** `/accounts/{id}`
* **Chemin Gateway :** `/EBANK-SERVICE/accounts/{id}`
* **Paramètre d'URL :** `id` (chaîne UUID)
* **Codes Retour :** `200 OK`, `404 Not Found`

---

### 3.3 Créer un nouveau compte bancaire
Crée un compte courant ou épargne rattaché à un client existant.

* **Méthode :** `POST`
* **Chemin Direct :** `/accounts`
* **Chemin Gateway :** `/EBANK-SERVICE/accounts`
* **En-tête :** `Content-Type: application/json`
* **Code Succès :** `201 Created`

#### Corps de la Requête (Request Body) :
```json
{
  "balance": 25000.00,
  "type": "SAVING-ACCOUNT",
  "customerId": 1
}
```

---

## 4. EBank Bot & Agent IA (Port 8058 / Route Gateway : `/EBANK-BOT`)

### 4.1 Discussion synchrone bloquante
Envoie une question textuelle à l'agent et attend la réponse complète.

* **Méthode :** `GET`
* **Chemin Direct :** `/chat`
* **Chemin Gateway :** `/EBANK-BOT/chat`
* **Paramètres de requête (Query Params) :**
  * `query` (requis) : Le message de l'utilisateur (ex: `Donne moi la liste des comptes`)
  * `conversationId` (optionnel, défaut `default`) : Identifiant de la session pour la mémoire conversationnelle.
* **Code Succès :** `200 OK` (Format `text/plain`)

---

### 4.2 Discussion en streaming réactif (Server-Sent Events / Flux)
Renvoie le flux de tokens textuels au fur et à mesure de leur génération par Google Gemini et de l'exécution des outils MCP.

* **Méthode :** `GET`
* **Chemin Direct :** `/chatStream`
* **Chemin Gateway :** `/EBANK-BOT/chatStream`
* **Paramètres de requête :**
  * `query` : Question de l'utilisateur
  * `conversationId` : Identifiant de session
* **Type de contenu :** `text/plain;charset=UTF-8`
* **Technologie :** Spring WebFlux `Flux<String>`

#### Exemple de test en ligne de commande :
```bash
curl -N -s "http://localhost:9999/EBANK-BOT/chatStream?query=Quelles%20sont%20les%20informations%20du%20client%201"
```

---

## 5. Endpoints du Protocole Model Context Protocol (MCP)

Les services métier exposent leurs outils pour l'orchestration IA via des transports HTTP Streamables :
* **Customer MCP Transport :** `http://localhost:8056/mcp`
* **EBank MCP Transport :** `http://localhost:8057/mcp`

Ces endpoints permettent au bot de découvrir dynamiquement les schémas des fonctions Java disponibles (`getAllCustomers()`, `getCustomerById()`, `getAllBankAccounts()`) et d'en demander l'exécution sécurisée.

