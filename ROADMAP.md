# 🗺️ Roadmap du Projet

## Versions planifiées

#### 🟡 v0.1.0 : Initialisation du Projet
**Description:** Mise en place de l'environnement de développement et structure de base
- [ ] Création du projet NestJS
- [ ] Configuration de base (tsconfig, eslint, prettier)
- [ ] Structure des dossiers (N-tiers)
- [ ] Configuration des variables d'environnement
- [ ] README initial
- [ ] Documentation de base
- [ ] Tests de la configuration

#### 🟡 v0.2.0 : Configuration Discord Developer
**Description:** Mise en place de l'intégration avec l'API Discord
- [ ] Création application Discord Developer
- [ ] Configuration des tokens et secrets
- [ ] Mise en place des webhooks Discord
- [ ] Configuration des permissions bot
- [ ] Tests de connexion Discord
- [ ] Documentation Discord Developer
- [ ] Tests unitaires intégration Discord


#### 🟡 v0.3.0 : Conteneurisation avec Docker
**Description:** Mise en place de l'environnement Docker
- [ ] Création Dockerfile
- [ ] Configuration docker-compose.yml
- [ ] Configuration des networks Docker
- [ ] Configuration des volumes
- [ ] Scripts de démarrage
- [ ] Documentation Docker
- [ ] Tests des conteneurs

#### 🟡 v0.4.0 : Base de Données PostgreSQL
**Description:** Configuration et mise en place de la base de données
1. Configuration initiale
   - [ ] Installation PostgreSQL dans Docker
   - [ ] Configuration TypeORM
   - [ ] Configuration des migrations
   - [ ] Tests de connexion

2. Modèles de données
   - [ ] Entity Members
   - [ ] Entity Discord_users
   - [ ] Entity Dashboard_accounts
   - [ ] Entity Identification_requests
   - [ ] Entity Guilds
   - [ ] Entity Guilds_configurations
   - [ ] Entity Roles
   - [ ] Entity Channels
   - [ ] Entity Categories
   - [ ] Entity Campuses
   - [ ] Entity Courses
   - [ ] Entity Promotions
   - [ ] Tests unitaires des entités



#### 🟡 v0.5.0 : CI/CD
**Description:** Mise en place de l'intégration et du déploiement continus
- [ ] Configuration GitHub Actions
- [ ] Pipeline de tests
- [ ] Pipeline de build
- [ ] Pipeline de déploiement
- [ ] Tests automatisés
- [ ] Documentation CI/CD
- [ ] Monitoring


#### 🟡 v0.6.0 : Architecture N-Tiers
**Description:** Implémentation de l'architecture en couches

1. Couche Controllers
   - [ ] MembersController
   - [ ] GuildsController
   - [ ] ChannelsController
   - [ ] CampusController
   - [ ] CoursesController
   - [ ] Tests unitaires controllers

2. Couche Services
   - [ ] MembersService
   - [ ] GuildsService
   - [ ] ChannelsService
   - [ ] CampusService
   - [ ] CoursesService
   - [ ] Tests unitaires services

3. Couche Repositories
   - [ ] Configuration des repositories
   - [ ] Tests unitaires repositories



#### 🟡 v0.7.0 : Logique Métier Core
**Description:** Implémentation des fonctionnalités métier essentielles

1. Gestion des Guildes
   - [ ] Création/Configuration guildes
   - [ ] Gestion des membres
   - [ ] Gestion des rôles
   - [ ] Tests unitaires guildes

2. Gestion des Campus
   - [ ] CRUD campus
   - [ ] Association membres/campus
   - [ ] Tests unitaires campus

3. Gestion des Formations
   - [ ] CRUD formations
   - [ ] Association campus/formations
   - [ ] Tests unitaires formations
