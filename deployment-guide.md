# Guide de Déploiement - Bots Discord API

Ce guide vous explique comment déployer l'application complète, qui se compose d'une API backend (NestJS), d'un bot Discord séparé, et d'une base de données PostgreSQL. Le tout est orchestré avec Docker et Nginx.

## 1. Prérequis

Pour déployer ce projet, vous aurez besoin des outils suivants installés sur votre serveur :
- **Git**
- **Docker** et **Docker Compose**
- **Nginx** (optionnel, inclus dans la configuration Docker)

## 2. Structure du Projet

Le projet se compose de deux dépôts séparés :
- `bots-discord-api/` : L'API backend en NestJS 
- `bot-discord-onboarding/` : Le bot Discord pour gérer l'onboarding des membres

## 3. Déploiement Manuel

Suivez ces étapes pour une installation propre et maîtrisée.

### Étape 1 : Cloner les Dépôts

Connectez-vous à votre serveur et clonez les deux dépôts :

```bash
# Cloner l'API backend
git clone <URL_DU_DEPOT_API_GIT>
cd bots-discord-api

# Cloner le bot Discord (dans un dossier séparé)
cd ..
git clone <URL_DU_DEPOT_BOT_GIT>
cd bot-discord-onboarding
```

### Étape 2 : Configurer l'API Backend

L'API backend a besoin de plusieurs variables d'environnement pour fonctionner.

1. **Créer le fichier `.env.production` :**
   ```bash
   cd ../bots-discord-api
   cp .env.production.example .env.production
   ```

2. **Remplir les variables :**
   Éditez le fichier `bots-discord-api/.env.production` et renseignez chaque variable :

| Variable                  | Description                                                                 | Exemple                           |
| ------------------------- | --------------------------------------------------------------------------- | --------------------------------- |
| `POSTGRES_HOST`           | Nom du service de la base de données (généralement `postgres`).             | `postgres`                        |
| `POSTGRES_PORT`           | Port de la base de données PostgreSQL.                                      | `5432`                            |
| `POSTGRES_USER`           | Nom d'utilisateur pour la base de données.                                  | `postgres`                        |
| `POSTGRES_PASSWORD`       | Mot de passe pour la base de données. **À sécuriser !**                     | `un_mot_de_passe_solide`          |
| `POSTGRES_DB`             | Nom de la base de données.                                                  | `bots_api`                        |
| `NODE_ENV`                | Environnement d'exécution (toujours `production`).                         | `production`                      |
| `PORT`                    | Port sur lequel l'API écoute.                                               | `3000`                            |
| `DATABASE_URL`            | URL de connexion complète à la base de données.                             | `postgresql://user:pass@host:5432/db` |
| `DISCORD_CLIENT_ID`       | ID Client de votre application OAuth2 Discord.                              | `123456789012345678`              |
| `DISCORD_CLIENT_SECRET`   | Secret Client de votre application OAuth2 Discord. **À sécuriser !**        | `un_secret_discord_tres_long`     |
| `DISCORD_REDIRECT_URI`    | URL de callback configurée dans le portail développeur Discord.             | `https://votre-domaine.com/auth/callback` |
| `DISCORD_BOT_TOKEN`       | Token de votre bot Discord. **À sécuriser !**                               | `un_token_de_bot_tres_long`       |
| `DISCORD_GUILD_ID`        | ID du serveur Discord autorisé à utiliser le bot.                           | `123456789012345678`              |
| `JWT_SECRET`              | Chaîne de caractères longue et aléatoire pour signer les tokens JWT.        | `une_phrase_secrete_tres_longue_et_aleatoire` |
| `JWT_EXPIRATION`          | Durée de validité d'un token JWT.                                           | `24h`                             |

### Étape 3 : Configurer le Bot Discord

1. **Créer le fichier `.env.production` pour le bot :**
   ```bash
   cd ../bot-discord-onboarding
   cp .env.example .env.production
   ```

2. **Remplir les variables du bot :**
   Éditez le fichier `bot-discord-onboarding/.env.production` :

| Variable                  | Description                                                                 | Exemple                           |
| ------------------------- | --------------------------------------------------------------------------- | --------------------------------- |
| `DISCORD_BOT_TOKEN`       | Token de votre bot Discord.                                                 | `votre_token_de_bot_discord`       |
| `DISCORD_CLIENT_ID`       | ID Client de votre application Discord.                                     | `123456789012345678`              |
| `DISCORD_GUILD_ID`        | ID du serveur Discord.                                                      | `123456789012345678`              |
| `API_URL`                 | URL de l'API backend (en interne via Docker).                               | `http://api:3000`                 |
| `NODE_ENV`                | Environnement d'exécution.                                                  | `production`                      |

### Étape 4 : Configurer Nginx

1. **Modifier la configuration Nginx :**
   Éditez le fichier `bots-discord-api/nginx/nginx.conf` et remplacez `your-domain.com` par votre vrai nom de domaine.

2. **Configurer les certificats SSL :**
   Si vous utilisez Let's Encrypt, assurez-vous que les chemins vers les certificats sont corrects.

### Étape 5 : Lancer l'Application

Retournez dans le dossier de l'API et lancez l'ensemble de l'application :

```bash
cd ../bots-discord-api
docker-compose -f docker-compose.prod.yml up -d --build
```

Cette commande va :
- Construire et démarrer l'API NestJS
- Construire et démarrer le bot Discord
- Démarrer la base de données PostgreSQL
- Démarrer Nginx comme reverse proxy

### Étape 6 : Vérifier le Déploiement

Vérifiez que tous les services fonctionnent correctement :

```bash
# Vérifier l'état des conteneurs
docker-compose -f docker-compose.prod.yml ps

# Voir les logs de l'API
docker-compose -f docker-compose.prod.yml logs api

# Voir les logs du bot
docker-compose -f docker-compose.prod.yml logs bot

# Tester l'endpoint de santé
curl https://votre-domaine.com/health
```

## 4. Mises à Jour

Pour mettre à jour l'application, le processus est simple :

```bash
# 1. Récupérer les derniers changements depuis Git
cd bots-discord-api
git pull

cd ../bot-discord-onboarding
git pull

# 2. Reconstruire et relancer les conteneurs
cd ../bots-discord-api
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Vérifier que tout fonctionne
docker-compose -f docker-compose.prod.yml ps
```

## 5. Déploiement Automatisé avec GitHub Actions

Le projet est équipé d'un workflow d'intégration et de déploiement continus (CI/CD) qui automatise la mise en production.

### Comment ça marche ?

Le workflow se déclenche à chaque `push` sur la branche `main` et :
1. **Construit l'image Docker** de l'API
2. **Pousse l'image** sur Docker Hub
3. **Se connecte au serveur** via SSH
4. **Déploie automatiquement** la nouvelle version

### Configuration des Secrets GitHub

Dans les paramètres de votre dépôt GitHub (`Settings > Secrets and variables > Actions`), ajoutez :

| Secret                  | Description                                                                 |
| ----------------------- | --------------------------------------------------------------------------- |
| `DOCKERHUB_USERNAME`    | Votre nom d'utilisateur Docker Hub.                                         |
| `DOCKERHUB_TOKEN`       | Un token d'accès généré depuis Docker Hub.                                  |
| `SSH_HOST`              | L'adresse IP ou le nom de domaine de votre serveur.                         |
| `SSH_USERNAME`          | Le nom d'utilisateur pour la connexion SSH.                                 |
| `SSH_KEY`               | La clé SSH privée pour la connexion.                                        |
| `SSH_PORT`              | Le port SSH de votre serveur (généralement `22`).                           |
| `POSTGRES_HOST`         | Nom du service de la base de données.                                       |
| `POSTGRES_PORT`         | Port de la base de données.                                                 |
| `POSTGRES_USER`         | Nom d'utilisateur pour la base de données.                                  |
| `POSTGRES_PASSWORD`     | Mot de passe pour la base de données.                                       |
| `POSTGRES_DB`           | Nom de la base de données de production.                                    |

## 6. Monitoring et Logs

### Accès aux Logs

```bash
# Logs de l'API
docker-compose -f docker-compose.prod.yml logs -f api

# Logs du bot
docker-compose -f docker-compose.prod.yml logs -f bot

# Logs de la base de données
docker-compose -f docker-compose.prod.yml logs -f db

# Logs de Nginx
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Health Checks

L'application inclut des health checks automatiques :
- **API** : `https://votre-domaine.com/health`
- **Base de données** : Vérification automatique de la connexion
- **Bot** : Vérification de la connexion Discord

## 7. Sécurité

### Recommandations

1. **Mots de passe forts** : Utilisez des mots de passe complexes pour la base de données
2. **Secrets Discord** : Gardez vos tokens Discord secrets et régénérez-les si compromis
3. **JWT Secret** : Utilisez une chaîne très longue et aléatoire
4. **Firewall** : Configurez votre serveur pour n'exposer que les ports nécessaires (80, 443, 22)
5. **SSL/TLS** : Utilisez toujours HTTPS en production
6. **Mises à jour** : Maintenez Docker et les images à jour

### Variables Sensibles

Ne commettez jamais les fichiers `.env.production` dans Git. Ils sont déjà dans `.gitignore`.

## 8. Dépannage

### Problèmes Courants

1. **L'API ne démarre pas** :
   ```bash
   docker-compose -f docker-compose.prod.yml logs api
   ```

2. **Le bot ne se connecte pas** :
   ```bash
   docker-compose -f docker-compose.prod.yml logs bot
   ```

3. **Problème de base de données** :
   ```bash
   docker-compose -f docker-compose.prod.yml logs db
   ```

4. **Nginx ne fonctionne pas** :
   ```bash
   docker-compose -f docker-compose.prod.yml logs nginx
   ```

### Commandes Utiles

```bash
# Redémarrer un service spécifique
docker-compose -f docker-compose.prod.yml restart api

# Voir l'utilisation des ressources
docker stats

# Nettoyer les images inutilisées
docker image prune -f

# Sauvegarder la base de données
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres bots_api > backup.sql
```

---

**Note importante** : Ce guide couvre le déploiement de l'API et du bot Discord. Si vous avez un frontend séparé, il faudra l'ajouter à la configuration Docker Compose et adapter ce guide en conséquence. 
