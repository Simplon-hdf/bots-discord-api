#!/bin/bash

# Script d'initialisation Let's Encrypt pour la production
# Usage: ./scripts/init-letsencrypt.sh your-domain.com your-email@example.com

DOMAIN=${1}
EMAIL=${2}

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Usage: $0 <domain> <email>"
    echo "Exemple: $0 api.monsite.com admin@monsite.com"
    exit 1
fi

echo "🔐 Initialisation Let's Encrypt pour $DOMAIN"

# Créer les dossiers nécessaires
sudo mkdir -p /etc/letsencrypt
sudo mkdir -p /var/www/certbot

# Remplacer le domaine dans la config nginx
sed -i "s/your-domain.com/$DOMAIN/g" nginx/nginx.conf

# Obtenir le certificat initial
docker run --rm \
    -v /etc/letsencrypt:/etc/letsencrypt \
    -v /var/www/certbot:/var/www/certbot \
    -p 80:80 \
    certbot/certbot \
    certonly --standalone \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

echo "✅ Certificats obtenus pour $DOMAIN"
echo "🚀 Vous pouvez maintenant démarrer avec:"
echo "   docker compose -f docker-compose.prod.yml up -d" 