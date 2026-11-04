# Architecture du Système — Smart E-Banking Microservices & Spring AI

> Documentation d'architecture technique, choix de conception, résilience et flux de données de la plateforme **Smart E-Banking**.

---

## 1. Vue d'Ensemble (High-Level Design)

La plateforme bancaire distribuée **Smart E-Banking** est conçue selon le paradigme des **Microservices Réactifs et Autonomes**. Elle combine la robustesse de l'écosystème **Spring Cloud**, la flexibilité d'une passerelle API réactive, la puissance de l'**Intelligence Artificielle Générative (Google Gemini 3.5 via Spring AI)** et le protocole standardisé **Model Context Protocol (MCP)** pour la découverte et l'exécution d'outils métier.

L'interface utilisateur adopte une approche moderne **Clean Light UI (Angular 19 & Tailwind CSS)**, offrant une expérience fluide en pleine largeur (*Edge-to-Edge*), des composants de données en grille Bento, et un streaming réactif mot-à-mot des réponses de l'agent.

---

## 2. Cartographie des Composants & Ports Réseau

| Composant | Module | Port | Rôle & Responsabilités | Technologies Clés |
| :--- | :--- | :---: | :--- | :--- |
| **Discovery Server** | `discovery-service` | `8761` | Enregistrement, annuaire dynamique et surveillance de santé (*Heartbeat*) de tous les microservices. | Spring Cloud Netflix Eureka |
| **API Gateway** | `gateway-service` | `9999` | Point d'entrée unique, routage dynamique basé sur la découverte, gestion globale des CORS et sécurité réseau. | Spring Cloud Gateway (WebFlux) |
| **Customer Service** | `customer-service` | `8056` | Gestion du cycle de vie des clients bancaires (CRUD), persistance relationnelle et exposition d'outils MCP. | Spring Boot 4, JPA, H2 Database, Spring AI MCP |
| **EBank Service** | `ebank-service` | `8057` | Gestion des comptes (Courants et Épargne), agrégation OpenFeign avec Customer-Service, tolérance aux pannes et outils MCP. | Spring Boot 4, JPA, OpenFeign, Resilience4j, Spring AI MCP |
| **EBank Bot** | `ebank-bot` | `8058` | Agent conversationnel intelligent, client MCP HTTP streamable, passerelles multi-canaux (Web Streaming, Telegram, Discord). | Spring AI, Google Gemini 3.5 Flash-Lite, TelegramBots, JDA Discord |
| **Client Web UI** | `angular-front` | `4200` | Interface utilisateur web moderne, dashboards Bento Grid, modales contextuelles et streaming Server-Sent Events. | Angular 19, TypeScript, Tailwind CSS, ngx-markdown |

---

## 3. Schéma Architectural Global

```mermaid
flowchart TD
    subgraph Clients ["Canaux Utilisateurs et Clients"]
        Web["Client Web Angular 19 (Port 4200)"]
        Telegram["Bot Telegram (@ebank1234_bot)"]
        Discord["Bot Discord (my-app)"]
    end

    subgraph Edge ["Couche d'Accès et Routage"]
        Tunnel["Cloudflare Tunnel (HTTPS Public)"]
        Gateway["Spring Cloud Gateway (Port 9999)"]
    end

    subgraph ServiceRegistry ["Découverte et Registre"]
        Eureka["Eureka Discovery Server (Port 8761)"]
    end

    subgraph Microservices ["Microservices Métier"]
        CustomerSvc["Customer-Service (Port 8056)"]
        EBankSvc["EBank-Service (Port 8057)"]
        BotSvc["EBank-Bot / Agent IA (Port 8058)"]
    end

    subgraph Persistence ["Persistance des Données"]
        CustomerDB[("H2 in-memory: customer-db")]
        EBankDB[("H2 in-memory: ebank-db")]
    end

    subgraph ExternalAI ["Moteur d'Intelligence Artificielle"]
        Gemini["Google Gemini 3.5 Flash-Lite API"]
    end

    %% Connexions Clients
    Web -->|HTTP / REST / SSE| Gateway
    Web -.->|Reverse Proxy Local| Tunnel
    Telegram -->|Long Polling Updates| BotSvc
    Discord -->|Gateway WebSocket| BotSvc

    %% Routage Gateway
    Gateway -->|Routage /CUSTOMER-SERVICE| CustomerSvc
    Gateway -->|Routage /EBANK-SERVICE| EBankSvc
    Gateway -->|Routage /EBANK-BOT| BotSvc

    %% Enregistrement Eureka
    CustomerSvc -.->|Enregistrement & Heartbeat| Eureka
    EBankSvc -.->|Enregistrement & Heartbeat| Eureka
    BotSvc -.->|Enregistrement & Heartbeat| Eureka
    Gateway -.->|Résolution dynamique des routes| Eureka

    %% Inter-service & MCP
    EBankSvc -->|OpenFeign Client + Resilience4j| CustomerSvc
    BotSvc -->|Model Context Protocol /mcp| CustomerSvc
    BotSvc -->|Model Context Protocol /mcp| EBankSvc
    BotSvc -->|Inférence & Génération de Prompts| Gemini

    %% Persistance
    CustomerSvc -->|JPA / Hibernate| CustomerDB
    EBankSvc -->|JPA / Hibernate| EBankDB
```

---

## 4. Flux Séquentiel : Agent IA & Protocole MCP

Le diagramme suivant illustre le cheminement complet d'une requête utilisateur (*« Donne moi la liste des comptes bancaires »*) via l'interface web ou les bots de messagerie :

```mermaid
sequenceDiagram
    autonumber
    actor User as Utilisateur (Web / Discord / Telegram)
    participant UI as Angular UI / WebClient
    participant Bot as EBank-Bot (Spring AI Agent)
    participant Gemini as Google Gemini 3.5
    participant EBank as EBank-Service (MCP Server)
    participant Customer as Customer-Service (MCP Server)
    participant DB as Bases H2 (Comptes et Clients)

    User->>UI: Saisie : "Donne moi la liste des comptes"
    UI->>Bot: GET /EBANK-BOT/chatStream?query=... (HTTP Flux)
    Bot->>Gemini: Prompt + Historique Mémoire + Schémas des Outils MCP
    Gemini-->>Bot: Décision d'Appel d'Outil : getAllBankAccounts()
    Bot->>EBank: Requête MCP Streamable HTTP -> /mcp
    EBank->>DB: Requête SQL (SELECT * FROM BANK_ACCOUNT)
    DB-->>EBank: Liste des entités comptes
    EBank->>Customer: OpenFeign -> getCustomerById(customerId)
    Customer->>DB: Requête SQL (SELECT * FROM CUSTOMER WHERE ID=?)
    DB-->>Customer: Données du titulaire
    Customer-->>EBank: DTO Client complet
    EBank-->>Bot: Réponse JSON MCP avec comptes et titulaires
    Bot->>Gemini: Injection des données d'exécution d'outil
    Gemini-->>Bot: Flux de tokens textuels formatés en Markdown
    Bot-->>UI: Server-Sent Events / Reactive Stream Chunks
    UI-->>User: Rendu dynamique mot-à-mot à l'écran
```

---

## 5. Patrons de Résilience & Tolérance aux Pannes

### Circuit Breaker & Fallback (Resilience4j)
Dans `ebank-service`, la communication avec `customer-service` est protégée par un disjoncteur Resilience4j :
```java
@CircuitBreaker(name = "customerService", fallbackMethod = "getDefaultCustomer")
public Customer getCustomerById(Long id) {
    return customerRestClient.getCustomerById(id);
}

public Customer getDefaultCustomer(Long id, Exception exception) {
    return Customer.builder()
            .id(id)
            .name("Client Temporairement Indisponible")
            .email("support@ebank.local")
            .build();
}
```
* **État FERMÉ (*Closed*) :** Les requêtes transitent normalement vers le service client.
* **État OUVERT (*Open*) :** En cas d'indisponibilité ou de dépassement de latence, le disjoncteur bascule automatiquement vers le fallback par défaut sans propager d'erreur HTTP 500.

---

## 6. Protocole Model Context Protocol (MCP)

Le protocole MCP standardise la manière dont les modèles de langage interagissent avec les systèmes d'information :
* **Serveurs MCP :** `customer-service` (port `8056/mcp`) et `ebank-service` (port `8057/mcp`) exposent leurs méthodes métier sous forme d'outils exécutables déclaratifs (`ToolCallback`).
* **Client MCP :** `ebank-bot` se connecte au démarrage via des transports `streamable-http` aux deux microservices.
* **Sécurité & Isolation :** Le LLM ne dispose d'aucun accès direct aux bases SQL ; il génère uniquement une intention d'appel que le client MCP valide et exécute en environnement contrôlé.

---

## 7. Persistance & Cycle de Vie des Données

* **Bases relationnelles H2 en mémoire :** Chaque microservice gère son propre schéma indépendant (`customer-db` et `ebank-db`), garantissant un découplage total sans dépendance partagée de base de données.
* **CommandLineRunner d'amorçage :** Des jeux de données réalistes sont initialisés à chaque démarrage (clients titulaires, comptes courants et comptes épargne avec soldes aléatoires).

