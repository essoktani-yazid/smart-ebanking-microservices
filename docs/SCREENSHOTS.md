# Galerie et Validations Visuelles du Projet Smart E-Banking

> Ce document compile les 16 captures d'ecran officielles du systeme, attestant du bon fonctionnement de chaque composant architectural (Microservices, Eureka, Gateway, OpenFeign, Resilience4j, Spring AI, MCP, Telegram, Discord et Frontend Angular 19).

---

## 1. Microservices Backend, Decouverte et Passerelle

### Capture 01 : Tableau de bord Eureka Service Registry
![Eureka Service Registry](screenshots/01-eureka-service-registry.png)

**Analyse et Validation Technique :**
Le tableau de bord Eureka valide l'enregistrement synchronise de tous les microservices applicatifs (`CUSTOMER-SERVICE`, `EBANK-SERVICE`, `GATEWAY-SERVICE`, `EBANK-BOT`). Chaque nœud remonte son statut operationnel `UP`, son adresse IP et son port d'ecoute respectif, permettant le routage dynamique sans adresses codees en dur.

---

### Capture 02 : Routage Unifie via Spring Cloud Gateway
![Gateway Unified Routing](screenshots/02-gateway-unified-routing.png)

**Analyse et Validation Technique :**
L'acces aux donnees des clients via `http://localhost:9999/CUSTOMER-SERVICE/customers` demontre la resolution dynamique des routes par la Gateway. Le client ne communique qu'avec le port unique `9999`, qui interroge Eureka et transfere la requete au service cible de maniere transparente.

---

### Capture 03 : Documentation OpenAPI Swagger UI du Customer Service
![Customer Service Swagger](screenshots/03-customer-service-swagger.png)

**Analyse et Validation Technique :**
L'interface Swagger UI du service client (port `8056`) valide le bon fonctionnement de l'endpoint `GET /customers`. La reponse `200 OK` confirme la persistance relationnelle sous H2 et l'exactitude de la serialisation JSON des entites clientes.

---

### Capture 04 : Documentation OpenAPI Swagger UI du Service EBank
![EBank Service Swagger](screenshots/04-ebank-service-swagger.png)

**Analyse et Validation Technique :**
L'endpoint `GET /accounts` documente sous Swagger UI atteste de la cohabitation des differents types de comptes bancaires avec leurs identifiants UUID et l'association de l'identifiant du client titulaire (`customerId`).

---

## 2. Communication Inter-Services et Tolerance aux Pannes

### Capture 05 : Integration OpenFeign et Agregation des Donnees Client
![OpenFeign Customer Aggregation](screenshots/05-openfeign-customer-aggregation.png)

**Analyse et Validation Technique :**
La reponse de l'endpoint `GET /accounts/{id}` illustre l'enrichissement en direct : le service des comptes a contacte de façon transparente le service client via OpenFeign pour injecter l'objet `customer` complet (nom, email) dans le DTO du compte bancaire retourne.

---

### Capture 06 : Declenchement du Fallback Resilience4j Circuit Breaker
![Resilience4j Circuit Breaker](screenshots/06-resilience4j-circuit-breaker.png)

**Analyse et Validation Technique :**
Suite a l'arret volontaire du microservice client, le disjoncteur Resilience4j intercepte l'erreur reseau et active immediatement la methode de repli `getDefaultCustomer`. Le compte bancaire est renvoye avec un titulaire par defaut (`Client Temporairement Indisponible`), assurant une continuite de service irréprochable sans propager d'erreur HTTP 500.

---

## 3. Agent IA Conversationnel, Protocole MCP et Multi-Canal

### Capture 07 : Execution d'Outils Metier MCP via Spring AI
![Spring AI MCP Tools](screenshots/07-spring-ai-mcp-tools.png)

**Analyse et Validation Technique :**
A la question portant sur la liste des comptes bancaires, le modele de langage Gemini formule une intention d'appel d'outil. Le client MCP interroge les endpoints distants `/mcp`, recupere les entites SQL reelles et synthetise une reponse structuree avec les soldes et coordonnees exacts.

---

### Capture 08 : Garde-fous de l'Agent IA (Refus Hors Contexte)
![Spring AI Guardrail Refusal](screenshots/08-spring-ai-guardrail-refusal.png)

**Analyse et Validation Technique :**
Validation des consignes de cadrage strictes (*system prompt*) imposees a l'agent conversationnel. Lorsqu'une requete externe sans rapport avec les donnees bancaires est formulee, l'agent active son mecanisme de refus de confiance et repond par la formule de repli prevue (*Je ne sais pas*), neutralisant les hallucinations.

---

### Capture 09 : Interaction Bancaire via le Bot Telegram
![Telegram Bot Banking](screenshots/09-telegram-bot-banking.png)

**Analyse et Validation Technique :**
Validation du composant `TelegramBot` connecte au compte officiel `@ebank1234_bot`. Les requetes transmises en mobilite sont traitees par le moteur Spring AI et restituees instantanement a l'utilisateur avec formatage clair des montants.

---

### Capture 10 : Interaction Bancaire via le Bot Discord
![Discord Bot Banking](screenshots/10-discord-bot-banking.png)

**Analyse et Validation Technique :**
Validation de l'ecoute d'evenements JDA sur un serveur Discord dedie. L'application repond de maniere autonome aux membres du salon avec prise en compte du protocole MCP et gestion du decoupage sous le plafond des 2 000 caracteres.

---

## 4. Interface Utilisateur Moderne (Angular 19 Clean Light UI)

### Capture 11 : Dashboard General et Grille Bento
![Angular Dashboard Bento Grid](screenshots/11-angular-dashboard-bento-grid.png)

**Analyse et Validation Technique :**
La page d'accueil illustre l'approche Clean Light UI : un arriere-plan doux `bg-slate-50`, une mise en page pleine largeur sans marge artificielle (*Edge-to-Edge*), des cartes Bento bien hierarchisees aux ombres legeres et les chiffres financiers clairs issus de la base de donnees.

---

### Capture 12 : Registre des Comptes Bancaires avec Filtrage Dynamique
![Angular Accounts Filters](screenshots/12-angular-accounts-filters.png)

**Analyse et Validation Technique :**
Le registre des comptes demontre la puissance du filtrage asynchrone cote client avec des pastilles de types distinctes, la mise en forme monospace des soldes et un controle rapide pour copier les identifiants UUID dans le presse-papiers.

---

### Capture 13 : Modale Contextuelle d'Ajout de Compte en Verre Depoli
![Angular New Account Modal](screenshots/13-angular-new-account-modal.png)

**Analyse et Validation Technique :**
L'ouverture de la modale "+ Nouveau Compte" permet de creer instantanement un compte bancaire en specifiant le solde initial, la typologie et le client rattache, avec effet givre d'arriere-plan (*backdrop-blur*) et mise a jour immediate du tableau.

---

### Capture 14 : Repertoire des Clients Bancaires
![Angular Clients Directory](screenshots/14-angular-clients-directory.png)

**Analyse et Validation Technique :**
Cette vue met en avant la gestion de la relation client : consultation des adresses email, identifiants uniques, avatars textuels colores generes a partir des initiales et modale d'enregistrement.

---

### Capture 15 : Tiroir Lateral Coulissant de l'Assistant IA (Slide-over Drawer)
![Angular AI Chatbot Drawer](screenshots/15-angular-ai-chatbot-drawer.png)

**Analyse et Validation Technique :**
Le tiroir lateral accessible par le bouton flottant offre une experience multitache fluide : l'utilisateur conserve sa vue de travail tout en interrogeant l'agent IA via des requetes suggerees en un clic.

---

### Capture 16 : Interface Conversationnelle Plein Ecran avec Selecteur de Modele
![Angular AI Chatbot Streaming](screenshots/16-angular-ai-chatbot-streaming.png)

**Analyse et Validation Technique :**
La page de discussion met en valeur la boite de saisie moderne epuree avec son selecteur de modele actif `gemini-3.5-flash-lite`, le streaming de tokens en temps reel et les puces d'outils MCP positionnees au bas de l'input.
