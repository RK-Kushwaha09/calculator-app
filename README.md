# Full-Stack Calculator (React + Java Spring Boot + MySQL)

A modern, production-ready Full-Stack 3-Tier Calculator web application designed to teach full-stack development and real cloud server deployment.

---

## Features
- **Modern React Frontend**: Glassmorphism UI with standard & scientific operations (`+`, `-`, `×`, `÷`, `xʸ`, `√`, `%`, `±`), responsive design, full keyboard shortcuts, and a live database history panel.
- **Robust Java Backend**: Spring Boot 3 REST API with validation, clean exception handling, and Spring Data JPA.
- **MySQL Persistence**: Stores all calculations with operands, operators, expression text, computed result, and timestamps.
- **Real Server Deployment Ready**: Includes production Nginx configuration, Linux `systemd` service files, automated deployment scripts, and an in-depth deployment guide (`DEPLOYMENT.md`).

---

## Project Structure
```
calculator-app/
├── frontend/                     # React application (Vite)
│   ├── src/
│   │   ├── components/           # Calculator, Keypad, Display, HistoryPanel
│   │   ├── services/api.js       # API client connecting to Spring Boot
│   │   ├── App.jsx               # Main UI & Health Monitor
│   │   └── index.css             # Dark modern UI styles
│   ├── vite.config.js            # Dev proxy config
│   └── package.json
│
├── backend/                      # Java Spring Boot REST API
│   ├── src/main/java/com/calculator/
│   │   ├── controller/           # REST endpoints (/api/calculator/*, /api/health)
│   │   ├── service/              # Mathematical evaluation & business logic
│   │   ├── repository/           # Spring Data JPA Repository
│   │   ├── model/                # MySQL JPA Entity (CalculationRecord)
│   │   └── dto/                  # Request / Response payloads
│   ├── src/main/resources/       # application.properties (Database config)
│   └── pom.xml                   # Maven dependencies
│
├── deploy/                       # Real Server Configurations
│   ├── nginx.conf                # Nginx reverse proxy configuration
│   ├── calculator.service        # Linux systemd auto-restart service
│   └── setup-server.sh           # 1-step automated setup script for Ubuntu
│
├── DEPLOYMENT.md                 # Complete guide to deploying on real cloud servers
└── README.md                     # Quickstart documentation
```

---

## Quickstart: Running Locally

### 1. Database Configuration
Make sure MySQL is running on your machine. In `backend/src/main/resources/application.properties`, adjust your MySQL credentials if needed:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```
*(Or set environment variables `MYSQL_USER` and `MYSQL_PASSWORD`).*

### 2. Run the Java Backend
Open a terminal in `backend/`:
```powershell
mvn spring-boot:run
```
The REST API will start on `http://localhost:8080`.

### 3. Run the React Frontend
Open a second terminal in `frontend/`:
```powershell
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## Deploying to a Real Server
To learn how to deploy this project to a live Linux server (AWS, DigitalOcean, Hetzner, etc.) with Nginx, systemd, and custom domains, read:
👉 **[DEPLOYMENT.md](./DEPLOYMENT.md)**
