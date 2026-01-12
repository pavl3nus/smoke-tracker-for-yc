#!/bin/bash

REPO_URL="https://github.com/pavl3nus/smoke-tracker-for-yc.git"
APP_DIR="/opt/smoke-tracker"


if [ -d "$APP_DIR" ]; then
    echo "Updating existing repository..."
    cd $APP_DIR
    git pull origin master
else
    echo "Cloning repository..."
    sudo git clone $REPO_URL $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
fi


cd $APP_DIR
cat > .env << EOF
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_SSL=true
DB_CA_PATH=/app/.postgresql/root.crt
CORS_ORIGIN=http://localhost:5173
EOF


mkdir -p backend/.postgresql
wget "https://storage.yandexcloud.net/cloud-certs/CA.pem" \
    -O backend/.postgresql/root.crt
chmod 0655 backend/.postgresql/root.crt


docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "Application deployed successfully!"