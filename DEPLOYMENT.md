# The Complete Guide to Deploying Full-Stack Apps to a Real Server
*(React Frontend + Java Spring Boot Backend + MySQL Database)*

If you have never deployed a project to a real server before, welcome! This guide will demystify the entire process step by step.

---

## 1. Core Concepts: What is a "Real Server"?

When developing on your own computer:
* You open terminals, run `npm run dev`, `mvn spring-boot:run`, and browse `http://localhost:5173`.
* As soon as you close your laptop or turn off your computer, **nobody else in the world can access it**.

A **real server** is simply a computer (usually running **Linux Ubuntu**) located in a data center (like Amazon AWS, DigitalOcean, Google Cloud, or Hetzner) that:
1. Stays powered on and connected to the high-speed internet **24 hours a day, 7 days a week**.
2. Has a **Public Static IP Address** (e.g., `198.51.100.45`) accessible to anyone in the world.
3. Does **not** have a graphical desktop (no mouse or windows)—you control it remotely via a secure command line called **SSH**.

---

## 2. The 3-Tier Architecture in Production

Here is how each layer of our Calculator app works on a real server:

```
                  [ Public Internet / User Browser ]
                                  │
                                  ▼ Port 80 (HTTP) / 443 (HTTPS)
                      ┌───────────────────────┐
                      │     NGINX Server      │  <-- Web Server & Reverse Proxy
                      └──────────┬────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         │ (Requests for UI: / )                         │ (Requests for API: /api/*)
         ▼                                               ▼
┌──────────────────┐                           ┌────────────────────────┐
│  React App       │                           │  Java Spring Boot API  │
│  (Static files:  │                           │  (calculator-backend.  │
│   HTML, JS, CSS) │                           │   jar running on       │
│  in /var/www/    │                           │   localhost:8080)      │
└──────────────────┘                           └───────────┬────────────┘
                                                           │
                                                           │ Internal Port 3306
                                                           ▼
                                               ┌────────────────────────┐
                                               │      MySQL Database    │
                                               │ (Table: calculations)  │
                                               └────────────────────────┘
```

### Why React does NOT need Node.js on the server
During development, Vite uses Node.js to hot-reload your code. But for production, you run `npm run build`, which turns all your React code into pure, static `.html`, `.js`, and `.css` files in the `frontend/dist` folder. **Nginx serves these static files directly and instantly**, saving server memory and CPU!

### Why Java uses an Executable JAR
Spring Boot packages your Java code, all libraries, and an embedded web server (Tomcat) into a single file: `calculator-backend-1.0.0.jar`. You only need Java installed on the server to run it.

### Why we use Nginx
Nginx is the front door. It receives all incoming traffic on port 80/443. It instantly serves your React files when users visit the home page, and forwards (`proxy_pass`) any `/api` requests to your Java Spring Boot process running safely behind the scenes.

---

## 3. Step-by-Step: Deploying on a Cloud Server (e.g. AWS EC2, DigitalOcean)

### Step 1: Create a Cloud Server (VPS)
1. Sign up for a cloud provider (e.g. [DigitalOcean](https://digitalocean.com), [AWS Lightsail/EC2](https://aws.amazon.com), or [Hetzner](https://hetzner.com)).
2. Create an instance (often called a **Droplet** or **EC2 Instance**):
   * **OS**: Ubuntu 22.04 LTS or 24.04 LTS.
   * **Plan**: Basic (1 vCPU, 1 GB or 2 GB RAM is plenty).
   * **Authentication**: SSH Key or root password.
3. Once created, note your server's **Public IP Address** (e.g., `123.45.67.89`).

---

### Step 2: Connect to Your Server via SSH
Open PowerShell or Terminal on your Windows computer and run:
```powershell
ssh root@123.45.67.89
```
*(Replace `123.45.67.89` with your actual server IP).*

You are now inside your remote Linux server!

---

### Step 3: Run the Automated Setup Script
We included a script `deploy/setup-server.sh` that automates installing Java, MySQL, Nginx, and security firewalls.

On your server, run:
```bash
# Download and execute the automated setup script
curl -sSL https://raw.githubusercontent.com/... (or copy deploy/setup-server.sh)
```
Or manually run these 4 standard commands:
```bash
# 1. Update and install Java, MySQL, and Nginx
sudo apt update && sudo apt install -y openjdk-21-jdk mysql-server nginx

# 2. Start MySQL and create the database
sudo mysql -e "CREATE DATABASE IF NOT EXISTS calculator_db;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'calculator_user'@'localhost' IDENTIFIED BY 'CalculatorPass2026!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON calculator_db.* TO 'calculator_user'@'localhost'; FLUSH PRIVILEGES;"

# 3. Create app folders
sudo mkdir -p /opt/calculator-app/backend
sudo mkdir -p /var/www/calculator-app/dist
```

---

### Step 4: Build Your Projects on Windows & Upload

#### A. Build Java Backend:
On your Windows machine inside `backend/`:
```powershell
mvn clean package -DskipTests
```
This generates `backend/target/calculator-backend-1.0.0.jar`.

#### B. Build React Frontend:
On your Windows machine inside `frontend/`:
```powershell
npm run build
```
This compiles everything into `frontend/dist/`.

#### C. Upload the files to your server:
Using `scp` (secure copy) directly from PowerShell:
```powershell
# Upload Java JAR
scp backend/target/calculator-backend-1.0.0.jar root@123.45.67.89:/opt/calculator-app/backend/

# Upload React Build
scp -r frontend/dist/* root@123.45.67.89:/var/www/calculator-app/dist/
```
*(You can also use a free graphical tool like [FileZilla](https://filezilla-project.org/) to drag and drop files via SFTP).*

---

### Step 5: Keep the Java Backend Running with `systemd`

On a server, you must run background tasks as **services** so they restart if the server reboots or crashes.

1. Copy our service definition `deploy/calculator.service` to `/etc/systemd/system/calculator.service`.
2. Tell Linux to load and start it:
```bash
sudo systemctl daemon-reload
sudo systemctl start calculator
sudo systemctl enable calculator   # Enables auto-start on server boot
```
3. Check its status:
```bash
sudo systemctl status calculator
```
*(You should see `Active: active (running)` in green).*

---

### Step 6: Configure Nginx Reverse Proxy

1. Open `/etc/nginx/sites-available/calculator.conf` and paste the contents of `deploy/nginx.conf`:
```nginx
server {
    listen 80 default_server;
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
```

2. Enable the configuration and restart Nginx:
```bash
sudo ln -sf /etc/nginx/sites-available/calculator.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t           # Verifies syntax is OK
sudo systemctl restart nginx
```

---

### Step 7: Open Your Browser!
Open your browser and navigate to:
```
http://123.45.67.89
```
Your Calculator will load! When you calculate `25 * 4 = 100`:
1. The browser calls `http://123.45.67.89/api/calculator/calculate`.
2. Nginx forwards the request to the Spring Boot JAR on `127.0.0.1:8080`.
3. Spring Boot calculates the result and saves the record in MySQL.
4. The response returns to the browser and adds to your calculation history!

---

## 4. How to Add a Domain Name and Free HTTPS (SSL)

Once you own a domain (e.g., `mycalculator.com` from Namecheap or GoDaddy):
1. In your domain registrar DNS settings, create an **A Record**:
   * **Host**: `@`
   * **Value / IP**: `123.45.67.89`
2. On your Ubuntu server, install Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
```
3. Run one command to get a free SSL certificate:
```bash
sudo certbot --nginx -d mycalculator.com
```
Certbot will automatically update Nginx and turn on `https://mycalculator.com` with auto-renewing certificates!

---

## 5. Helpful Commands for Server Maintenance

| Task | Command |
|---|---|
| View live Java logs | `sudo journalctl -u calculator -f` |
| Restart Java Backend | `sudo systemctl restart calculator` |
| Check if port 8080 & 3306 are active | `sudo ss -tulpn` |
| View Nginx error logs | `sudo tail -f /var/log/nginx/error.log` |
| Check MySQL status | `sudo systemctl status mysql` |
| Restart Nginx | `sudo systemctl restart nginx` |
