<div align="center">
  <!-- En-tete Dynamique & Visuel -->
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0d9488&height=180&section=header&text=SMART%20E-BANKING&fontSize=52&fontAlignY=38&fontColor=ffffff" width="100%"/>

  <!-- Animation texte ciblant les piliers cles de la plateforme -->
  <img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=700&size=20&duration=3000&pause=1000&color=0d9488&center=true&vCenter=true&width=750&lines=Architecture+Microservices+Distribuee+%26+Resiliente;Agent+IA+Conversationnel+Google+Gemini+3.5+%26+Protocole+MCP;Frontend+Moderne+Clean+Light+UI+avec+Angular+19;Multi-Canaux+%3A+Web+Streaming%2C+Telegram+%26+Discord" alt="Typing SVG" />

  <br/>

  <!-- Badges Technologiques -->
  <p>
    <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17">
    <img src="https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
    <img src="https://img.shields.io/badge/Spring_Cloud-2025.1.0-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Cloud">
    <img src="https://img.shields.io/badge/Spring_AI-Gemini_3.5-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Spring AI">
    <img src="https://img.shields.io/badge/MCP-Protocol-8A2BE2?style=for-the-badge" alt="Model Context Protocol">
    <img src="https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 19">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
  </p>
</div>

---

## A Propos du Projet

**Smart E-Banking** est une plateforme bancaire distribuee de nouvelle generation concue pour repondre aux exigences critiques de haute disponibilite, de tolerance aux pannes et d'automatisation intelligente par l'IA.

Elle associe une architecture backend decouplee en microservices **Spring Boot / Spring Cloud** a un agent d'intelligence artificielle conversationnelle base sur **Google Gemini 3.5 Flash-Lite**. Grace au standard **Model Context Protocol (MCP)**, le modele de langage decouvre et execute en toute securite les operations metier bancaires (consultation des soldes, coordonnees des titulaires, typologie des comptes) sur les services distants.

L'experience utilisateur est declinee sur une interface web reactive concue en mode clair (**Clean Light UI avec Angular 19**) ainsi que sur des canaux de messagerie instantanee tiers (**Telegram** et **Discord**).

> [!NOTE]
> - Pour une analyse approfondie des choix d'architecture, des diagrammes Mermaid et des flux d'echanges, consultez la [Documentation d'Architecture](docs/ARCHITECTURE.md).
> - La specification exhaustive des endpoints est detaillee dans la [Reference API](docs/API.md).
> - L'ensemble des 16 captures d'ecran d'execution avec analyses detaillees est compile dans la [Galerie des Validations Visuelles](docs/SCREENSHOTS.md).

---

## Pourquoi Utiliser ce Projet ?

- **Resilience & Isolation :** Chaque domaine metier (Clients, Comptes, IA) dispose de son propre microservice et de sa base de donnees isolee. Les indisponibilites reseau sont absorbees par le disjoncteur **Resilience4j Circuit Breaker** avec bascule transparente vers des fallbacks.
- **Orchestration d'IA par Outils (Tool-Calling MCP) :** L'agent IA dialogue en HTTP Streamable avec les microservices via le protocole ouvert MCP, garantissant un controle d'execution strict et une fraicheur absolue des donnees bancaires.
- **Streaming Reactif en Temps Reel :** Reception des reponses mot par mot en streaming Server-Sent Events (SSE / WebFlux Flux) pour une latence perçue quasi-nulle.
- **Interface Utilisateur Moderne (Clean Light UI) :** Architecture en Bento Grid, mise en page pleine largeur sans marge superflue (*Edge-to-Edge Canvas*), modales centrees avec flou d'arriere-plan (*Frosted Glass*) et tiroir lateral coulissant (*Slide-over Drawer*).

### Stack Technique

| Domaine | Technologies |
| :--- | :--- |
| **Backend & Microservices** | Java 17, Spring Boot 4.1.1, Spring Data JPA, H2 Database, Lombok, OpenFeign, Resilience4j |
| **Passerelle & Decouverte** | Spring Cloud Gateway (WebFlux reactif), Netflix Eureka Discovery Server |
| **Intelligence Artificielle** | Spring AI 2.0.1, Google Gemini 3.5 Flash-Lite, Model Context Protocol (MCP Streamable HTTP) |
| **Bots Multi-Canaux** | TelegramBots SDK (Long Polling), JDA Discord (Java Discord API WebSocket) |
| **Frontend Web** | Angular 19, TypeScript, Tailwind CSS, ngx-markdown, Bootstrap Icons |
| **DevOps & Reseau** | Cloudflare Zero-Firewall Tunnel, Scripts d'orchestration Bash daemonise |

---

## Matrice des Validations Techniques

Afin de garantir un chargement rapide et leger du fichier README, toutes les captures d'ecran haute resolution et leurs analyses pas-a-pas sont centralisees dans le document dedie [`docs/SCREENSHOTS.md`](docs/SCREENSHOTS.md).

| ID | Intitule de la Validation | Composant Valide | Lien vers la Preuve |
| :---: | :--- | :--- | :---: |
| **01** | Enregistrement dynamique et surveillance heartbeat | Eureka Discovery Server (Port 8761) | [Voir Capture 01](docs/SCREENSHOTS.md#capture-01--tableau-de-bord-eureka-service-registry) |
| **02** | Resolution et routage unifie des requetes clientes | Spring Cloud Gateway (Port 9999) | [Voir Capture 02](docs/SCREENSHOTS.md#capture-02--routage-unifie-via-spring-cloud-gateway) |
| **03** | Documentation et execution des endpoints Clients | Customer Service OpenAPI / Swagger UI (Port 8056) | [Voir Capture 03](docs/SCREENSHOTS.md#capture-03--documentation-openapi-swagger-ui-du-customer-service) |
| **04** | Documentation et persistance des comptes courants et epargne | EBank Service OpenAPI / Swagger UI (Port 8057) | [Voir Capture 04](docs/SCREENSHOTS.md#capture-04--documentation-openapi-swagger-ui-du-service-ebank) |
| **05** | Communication synchrone et agregation du titulaire client | OpenFeign Client Inter-Services | [Voir Capture 05](docs/SCREENSHOTS.md#capture-05--integration-openfeign-et-agregation-des-donnees-client) |
| **06** | Activation du disjoncteur et reponse de repli sans HTTP 500 | Resilience4j Circuit Breaker Fallback | [Voir Capture 06](docs/SCREENSHOTS.md#capture-06--declenchement-du-fallback-resilience4j-circuit-breaker) |
| **07** | Resolution d'outils metier SQL via Model Context Protocol | Spring AI MCP Client & Outils `@Tool` | [Voir Capture 07](docs/SCREENSHOTS.md#capture-07--execution-doutils-metier-mcp-via-spring-ai) |
| **08** | Respect strict du prompt systeme et refus des requetes hors contexte | Spring AI Guardrails & Prompt Framing | [Voir Capture 08](docs/SCREENSHOTS.md#capture-08--garde-fous-de-lagent-ia-refus-hors-contexte) |
| **09** | Reception, invocation MCP et restitution sur mobile | Telegram Bot (`@ebank1234_bot`) | [Voir Capture 09](docs/SCREENSHOTS.md#capture-09--interaction-bancaire-via-le-bot-telegram) |
| **10** | Ecoute d'evenements JDA et decoupage sous les 2 000 caracteres | Discord Bot (Serveur E-Banking) | [Voir Capture 10](docs/SCREENSHOTS.md#capture-10--interaction-bancaire-via-le-bot-discord) |
| **11** | En-tete epure, grille Bento et indicateurs financiers temps reel | Angular 19 Clean Light UI Dashboard | [Voir Capture 11](docs/SCREENSHOTS.md#capture-11--dashboard-general-et-grille-bento) |
| **12** | Filtrage asynchrone, badges de typologie et copie rapide UUID | Registre des Comptes Bancaires | [Voir Capture 12](docs/SCREENSHOTS.md#capture-12--registre-des-comptes-bancaires-avec-filtrage-dynamique) |
| **13** | Saisie ergonomique avec arriere-plan floute (*frosted glass*) | Modale Contextuelle Nouveau Compte | [Voir Capture 13](docs/SCREENSHOTS.md#capture-13--modale-contextuelle-dajout-de-compte-en-verre-depoli) |
| **14** | Repertoire des clients, avatars colores et modale titulaire | Gestion des Clients Bancaires | [Voir Capture 14](docs/SCREENSHOTS.md#capture-14--repertoire-des-clients-bancaires) |
| **15** | Bouton flottant (FAB) et panneau multitache coulissant | Tiroir Lateral (Slide-over Drawer) | [Voir Capture 15](docs/SCREENSHOTS.md#capture-15--tiroir-lateral-coulissant-de-lassistant-ia-slide-over-drawer) |
| **16** | Boite de saisie moderne, selecteur de modele et puces MCP | Assistant IA Conversationnel Plein Ecran | [Voir Capture 16](docs/SCREENSHOTS.md#capture-16--interface-conversationnelle-plein-ecran-avec-selecteur-de-modele) |

---

## Description Detaillee par Partie

### Partie 1 : Microservices Backend, Decouverte et Passerelle

Cette premiere etape pose les fondations distributees de la plateforme :
1. **Eureka Discovery Server (`discovery-service`, port 8761) :** Centralise l'enregistrement dynamique de l'ensemble des instances applicatives.
2. **Spring Cloud Gateway (`gateway-service`, port 9999) :** Point d'entree unique assurant le routage reactif non-bloquant base sur la decouverte d'instances, avec resolution dynamique des routes (`/CUSTOMER-SERVICE/**`, `/EBANK-SERVICE/**`, `/EBANK-BOT/**`) et configuration globale CORS.
3. **Customer Service (`customer-service`, port 8056) :** Microservice gerant la persistance des entites `Customer` (identifiant, nom, email) sous base H2 en memoire, documente via OpenAPI Swagger UI.
4. **EBank Service (`ebank-service`, port 8057) :** Microservice de gestion des comptes bancaires supportant deux typologies (`CURRENT_ACCOUNT`, `SAVING_ACCOUNT`), avec attribution d'identifiants uniques UUID, date de creation et solde initial.

*Preuves visuelles d'execution :* [Consulter les Captures 01 a 04 dans la Galerie](docs/SCREENSHOTS.md#1-microservices-backend-decouverte-et-passerelle)

---

### Partie 2 : Communication Inter-Services et Tolerance aux Pannes

Afin de repondre aux problematiques de couplage et de cascades de defaillances dans les architectures distribuees :
1. **Client Declaratif OpenFeign :** Le microservice `ebank-service` s'appuie sur une interface `CustomerRestClient` annotee `@FeignClient` pour recuperer et agreger a la volee les informations detaillees du titulaire d'un compte bancaire.
2. **Disjoncteur Resilience4j :** L'appel Feign est enveloppe par l'annotation `@CircuitBreaker(name = "customerService", fallbackMethod = "getDefaultCustomer")`.
3. **Mecanisme de Repli Gracieux (Fallback) :** En cas de surcharge, lenteur ou panne franche du microservice `customer-service`, l'appel bascule sans delai vers la methode de fallback, retournant un profil fictif securise sans generer d'erreur HTTP 500 pour l'utilisateur final.

*Preuves visuelles d'execution :* [Consulter les Captures 05 et 06 dans la Galerie](docs/SCREENSHOTS.md#2-communication-inter-services-et-tolerance-aux-pannes)

---

### Partie 3 : Agent IA Conversationnel, Protocole MCP et Multi-Canal

Cette partie met en place un assistant intelligent capable d'interagir directement avec le systeme d'information bancaire :
1. **Spring AI & Google Gemini 3.5 Flash-Lite (`ebank-bot`, port 8058) :** Moteur conversationnel configure avec un prompt systeme strict interdisant les hallucinations et restreignant les reponses au perimetre strict de la banque.
2. **Model Context Protocol (MCP) :** Exposition d'outils `@Tool` en HTTP Streamable sur les microservices distants. L'agent IA inspecte les capacites disponibles, execute des requetes metier reelles et restitue les resultats consolides.
3. **Streaming Reactif SSE :** Endpoint `/chatStream` diffusant la reponse mot par mot sous la forme d'un flux reactif `Flux<String>` WebFlux.
4. **Passerelles Multi-Canaux :**
   - **Telegram :** Bot `@ebank1234_bot` connecte via le SDK `telegram-spring-boot-starter`.
   - **Discord :** Bot connecte a l'API Discord WebSocket via JDA, avec partitionnement intelligent des reponses longues.

*Preuves visuelles d'execution :* [Consulter les Captures 07 a 10 dans la Galerie](docs/SCREENSHOTS.md#3-agent-ia-conversationnel-protocole-mcp-et-multi-canal)

---

### Partie 4 : Interface Utilisateur Moderne (Angular 19 Clean Light UI)

L'interface web applique les principes de design modernes *Clean Light UI* :
1. **Architecture Bento Grid & Canvas Plein Ecran :** Suppression des marges rigides superflues (*Edge-to-Edge*), palette slate/teal raffinee, typographie `JetBrains Mono` pour les montants financiers et cartes Bento aux bordures douces.
2. **Filtres et Actions Contextuelles :** Tableau des comptes filtrable par typologie (*Tous*, *Courant*, *Epargne*), recherche plein texte et copie instantanee des identifiants UUID en un clic.
3. **Modales en Verre Depoli (*Frosted Glass*) :** Formulaires d'ajout de compte et de client encapsules dans des modales centrees avec flou d'arriere-plan (`backdrop-blur-sm`).
4. **Tiroir Coulissant (*Slide-over Drawer*) :** Assistant bancaire accessible en continu depuis n'importe quel ecran sans perdre son contexte de consultation.
5. **Page IA Dediee avec Selecteur de Modele :** Boite de saisie moderne affichant le selecteur `gemini-3.5-flash-lite`, le streaming de reponses en Markdown enrichi et les suggestions d'outils MCP positionnees sous l'input.

*Preuves visuelles d'execution :* [Consulter les Captures 11 a 16 dans la Galerie](docs/SCREENSHOTS.md#4-interface-utilisateur-moderne-angular-19-clean-light-ui)

---

## Pour Commencer (Quickstart)

### Prerequis
- **Java JDK :** Version 17+ (`java -version`)
- **Node.js :** Version 20+ et npm (`node -v`)
- **Maven :** Version 3.8+ (`mvn -v`)
- **Cles d'API (Optionnel pour l'IA et les bots) :**
  - Google Gemini API Key (`GEMINI_API_KEY`)
  - Telegram Bot Token (`TELEGRAM_TOKEN`)
  - Discord Bot Token (`DISCORD_TOKEN`)

### Deploiement & Orchestration Complete

La plateforme dispose de scripts d'orchestration autonomes gerant le demarrage sequentiel, la verification de sante des ports et la supervision :

```bash
# 1. Cloner le depot
git clone https://github.com/essoktani-yazid/smart-ebanking-microservices.git
cd smart-ebanking-microservices

# 2. Configurer les cles d'environnement (optionnel si execute avec les valeurs par defaut)
export GEMINI_API_KEY="votre_cle_gemini"
export TELEGRAM_TOKEN="votre_token_telegram"
export DISCORD_TOKEN="votre_token_discord"

# 3. Lancer l'integralite de la plateforme (Microservices + Frontend + Tunnel HTTPS)
./start-all.sh
```

Pour executer la plateforme en continu sous forme de demon supervise :
```bash
./run-daemon.sh
```

Pour stopper l'ensemble des services et liberer tous les ports :
```bash
./stop-all.sh
```

### Exemples Concrets d'Appels API

```bash
# 1. Verifier la Gateway (Port 9999)
curl -s http://localhost:9999/CUSTOMER-SERVICE/customers

# 2. Consulter la liste des comptes avec titulaires agreges
curl -s http://localhost:9999/EBANK-SERVICE/accounts

# 3. Interroger l'agent IA conversationnel en streaming reactif
curl -N -s "http://localhost:9999/EBANK-BOT/chatStream?query=Donne%20moi%20la%20liste%20des%20comptes%20bancaires"
```

---

## Structure du Repertoire

```text
smart-ebanking-microservices/
|-- discovery-service/          # Netflix Eureka Discovery Server (Port 8761)
|-- gateway-service/            # Spring Cloud Gateway Reactive (Port 9999)
|-- customer-service/           # Microservice Gestion Clients & Outils MCP (Port 8056)
|-- ebank-service/              # Microservice Gestion Comptes, Feign & MCP (Port 8057)
|-- ebank-bot/                  # Agent IA Spring AI, Gemini 3.5, Telegram & Discord (Port 8058)
|-- angular-front/              # Application Frontend Angular 19 Clean Light UI (Port 4200)
|-- docs/                       # Suite Documentaire Complete
|   |-- ARCHITECTURE.md         # Conception, Diagrammes Mermaid & Resilience
|   |-- API.md                  # Reference et Specification des Endpoints
|   |-- SCREENSHOTS.md          # Galerie Complete des 16 Captures & Analyses Techniques
|   `-- screenshots/            # Fichiers PNG Haute Resolution
|-- start-all.sh                # Script de demarrage sequentiel avec verification de sante
|-- stop-all.sh                 # Script d'arret propre et liberation des ports
|-- run-daemon.sh               # Superviseur de daemon en arriere-plan
|-- LICENSE                     # Licence MIT (Yazid ESSOKTANI)
`-- README.md                   # Documentation Principale
```

---

## Auteur

<div align="center">

**Yazid ESSOKTANI**  
*Full-Stack Web & AI Developer | Master SDIA2 (Systemes Distribues & Intelligence Artificielle)*

[![Portfolio](https://img.shields.io/badge/Portfolio-essoktani.tech-0d9488?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.essoktani.tech/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Yazid_ESSOKTANI-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yazid-essoktani-337549251)
[![GitHub](https://img.shields.io/badge/GitHub-@essoktani--yazid-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/essoktani-yazid)

</div>

---

## Licence

Ce projet est distribue sous la licence libre **MIT**. Consultez le fichier [`LICENSE`](LICENSE) pour plus d'informations.
