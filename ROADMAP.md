# 🗺️ Roadmap du Projet

## Versions planifiées

#### 🟡 v0.1.0 : Initialisation du Projet
- [ ] Création du projet NestJS
- [ ] Configuration de base (tsconfig, eslint, prettier)
- [ ] Structure des dossiers (N-tiers)
- [ ] Configuration des variables d'environnement
- [ ] README initial
- [ ] Documentation de base
- [ ] Tests de la configuration
- [ ] Création application Discord Developer
- [ ] Configuration des tokens et secrets
- [ ] Mise en place des webhooks Discord
- [ ] Configuration des permissions bot
- [ ] Tests de connexion Discord
- [ ] Documentation Discord Developer
- [ ] Tests unitaires intégration Discord
- [ ] Création Dockerfile
- [ ] Configuration docker-compose.yml
- [ ] Configuration des networks Docker
- [ ] Configuration des volumes
- [ ] Scripts de démarrage
- [ ] Documentation Docker
- [ ] Tests des conteneurs
- [ ] Installation PostgreSQL dans Docker
- [ ] Configuration TypeORM
- [ ] Configuration des migrations
- [ ] Tests de connexion
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
- [ ] Configuration GitHub Actions
- [ ] Pipeline de tests
- [ ] Pipeline de build
- [ ] Pipeline de déploiement
- [ ] Tests automatisés
- [ ] Documentation CI/CD
- [ ] Monitoring


#### 🟡 v0.2.0 : Architecture N-Tiers
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



#### 🟡 v0.3.0 : Logique Métier Core
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


#### 🟡 v0.4.0 : Documentation API avec Swagger
**Description:** Documentation complète de l'API
- [ ] Configuration Swagger
- [ ] Documentation des endpoints
- [ ] Documentation des modèles
- [ ] Documentation des réponses
- [ ] Tests de la documentation
- [ ] Génération documentation
- [ ] Interface interactive



#### 🟡 v0.5.0 : Dashboard Minimal
**Description:** Interface d'administration basique
- [ ] Interface de connexion
- [ ] Gestion des guildes
- [ ] Gestion des membres
- [ ] Gestion des campus
- [ ] Gestion des formations
- [ ] Tests E2E dashboard
- [ ] Documentation utilisateur


#### 🟡 v0.6.0 : Tests et Qualité
**Description:** Couverture complète des tests
1. Tests Unitaires
   - [ ] Tests controllers
   - [ ] Tests services
   - [ ] Tests repositories
   - [ ] Tests helpers

2. Tests E2E
   - [ ] Tests flows complets
   - [ ] Tests intégration Discord
   - [ ] Tests dashboard

3. Qualité
   - [ ] Coverage > 80%
   - [ ] Linting
   - [ ] Documentation complète
