# 🔐 Configuration HTTPS Production

## 🎯 Stratégie
- **Développement** : HTTP simple (`http://localhost:3000`)
- **Production** : HTTPS avec Let's Encrypt via nginx

## 🚀 Déploiement Production avec HTTPS

### 1. Préparer l'environnement
```bash
# Créer le fichier .env.production avec vos vraies variables
cp .env .env.production
# Éditer .env.production avec les bonnes valeurs (DB_PASSWORD, JWT_SECRET, etc.)
```

### 2. Initialiser Let's Encrypt
```bash
# Remplacer par votre vraie domaine et email
./scripts/init-letsencrypt.sh api.mondomaine.com admin@mondomaine.com
```

### 3. Démarrer en production
```bash
docker compose -f docker-compose.prod.yml up -d
```

## 🌐 Accès Production

- **HTTP** → Redirection automatique vers HTTPS
- **HTTPS** : `https://votre-domaine.com`
- **Documentation** : `https://votre-domaine.com/api`

## 🔧 Configuration

### Fichiers de production :
- `docker-compose.prod.yml` - Stack complète avec nginx + Let's Encrypt
- `nginx/nginx.conf` - Configuration nginx HTTPS
- `scripts/init-letsencrypt.sh` - Script d'initialisation SSL

### Variables d'environnement (.env.production) :
```env
# Base de données
DB_HOST=db
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe_securise
DB_DATABASE=bots-api

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# Discord
DISCORD_CLIENT_ID=votre_client_id
DISCORD_CLIENT_SECRET=votre_client_secret
DISCORD_REDIRECT_URI=https://votre-domaine.com/auth/callback
ALLOWED_GUILD_ID=votre_guild_id
DISCORD_BOT_TOKEN=votre_bot_token
```

## 🔄 Renouvellement automatique

Le container `certbot` se charge automatiquement du renouvellement des certificats tous les 12h.

## ⚡ Développement (HTTP uniquement)

```bash
docker compose -f docker-compose.dev.yml up -d
# API accessible sur http://localhost:3000
```

## 🔐 Configuration HTTPS

## 🚀 Démarrage rapide

### 1. Générer les certificats SSL (une seule fois)
```bash
chmod +x scripts/generate-ssl-certs.sh
./scripts/generate-ssl-certs.sh
```

### 2. Démarrer l'API (HTTP)
```bash
docker compose -f docker-compose.dev.yml up -d
```

### 3. Ajouter HTTPS avec nginx
```bash
docker compose -f nginx-proxy.yml up -d
```

## 🌐 Accès

- **HTTP (redirige vers HTTPS)** : http://localhost:8080
- **HTTPS** : https://localhost:8443
- **API directe (développement)** : http://localhost:3000

## ⚠️ Certificats auto-signés

Les certificats sont auto-signés pour le développement. Votre navigateur affichera un avertissement de sécurité que vous pouvez ignorer en développement.

## 🎯 Architecture

```
Requête HTTPS → Nginx (8443) → API Docker (3000)
```

## 📁 Fichiers

- `nginx-proxy.yml` - Configuration Docker pour nginx
- `nginx/nginx-simple.conf` - Configuration nginx HTTPS
- `scripts/generate-ssl-certs.sh` - Génération certificats dev 