#!/usr/bin/env bash
# ==============================================================================
# Full-Stack Calculator Server Automated Setup Script (Ubuntu 22.04 / 24.04 LTS)
# Run with sudo: sudo bash setup-server.sh
# ==============================================================================

set -e

echo ">>> [1/6] Updating system packages..."
apt update && apt upgrade -y

echo ">>> [2/6] Installing OpenJDK 21, MySQL Server, and Nginx..."
apt install -y openjdk-21-jdk mysql-server nginx ufw

echo ">>> [3/6] Setting up MySQL Database and User..."
# Generate secure database credentials
DB_NAME="calculator_db"
DB_USER="calculator_user"
DB_PASS="CalculatorPass2026!"

mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

echo ">>> Database '${DB_NAME}' and user '${DB_USER}' created successfully."

echo ">>> [4/6] Creating deployment directories..."
mkdir -p /opt/calculator-app/backend
mkdir -p /var/www/calculator-app/dist

echo ">>> [5/6] Setting up Linux systemd Service for Java..."
cat <<EOF > /etc/systemd/system/calculator.service
[Unit]
Description=Calculator Spring Boot REST API
After=syslog.target network.target mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/calculator-app/backend
ExecStart=/usr/bin/java -Xms128m -Xmx512m -jar /opt/calculator-app/backend/calculator-backend-1.0.0.jar
Environment="MYSQL_HOST=localhost"
Environment="MYSQL_PORT=3306"
Environment="MYSQL_DB=${DB_NAME}"
Environment="MYSQL_USER=${DB_USER}"
Environment="MYSQL_PASSWORD=${DB_PASS}"
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload

echo ">>> [6/6] Configuring Nginx..."
cat <<'EOF' > /etc/nginx/sites-available/calculator.conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/calculator-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable Nginx site
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/calculator.conf /etc/nginx/sites-enabled/calculator.conf
nginx -t && systemctl restart nginx

echo ">>> Configuring Firewall (allowing SSH, HTTP, HTTPS)..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "=========================================================================="
echo ">>> SERVER SETUP COMPLETE!"
echo ">>> Next steps:"
echo " 1. Copy your compiled 'calculator-backend-1.0.0.jar' to /opt/calculator-app/backend/"
echo " 2. Run: systemctl start calculator && systemctl enable calculator"
echo " 3. Copy your compiled React 'dist/' folder to /var/www/calculator-app/dist/"
echo " 4. Open your browser and visit your server's Public IP address!"
echo "=========================================================================="
