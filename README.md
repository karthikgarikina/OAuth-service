# OAuth 2.0 Authentication Service

A **production-ready RESTful authentication service** implementing secure authentication and authorization mechanisms suitable for real-world applications.

---

## 🚀 Features

- Local authentication (Email & Password)
- OAuth 2.0 authentication (Google & GitHub)
- JWT-based Access & Refresh Tokens
- Role-Based Access Control (RBAC)
- Rate limiting backed by Redis
- PostgreSQL for persistent storage
- Fully containerized using Docker & Docker Compose

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express, TypeScript  
- **Database:** PostgreSQL  
- **Cache / Rate Limiting:** Redis  
- **Authentication:** JWT, OAuth 2.0  
- **Containerization:** Docker, Docker Compose  

---

## 📦 Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/karthikgarikina/OAuth-service
cd OAuth-service
```

### 2️⃣ Configure environment variables
```bash
cp .env
```

Fill in the required values:
- Database credentials
- Redis configuration
- JWT secrets
- OAuth credentials (Google & GitHub)

---

### 3️⃣ Run the application
```bash
docker-compose up --build
```

The API will be available once all containers are healthy.

---

## 🔐 API Overview

### Health Check
- `http://localhost:9090/health`

### Authentication Routes
- `POST http://localhost:9090/api/auth/register` – Register a new user
- `POST http://localhost:9090/api/auth/login` – Login with email & password
- `POST http://localhost:9090/api/auth/refresh` – Refresh access token

### OAuth Routes
- `GET http://localhost:9090/api/auth/google` – Google OAuth login
- `GET http://localhost:9090/api/auth/github` – GitHub OAuth login

### User Routes
- `GET http://localhost:9090/api/users/me` – Get current authenticated user
- `GET http://localhost:9090/api/users` – Get all users (**Admin only**)

---

## 🧪 Testing

Automated tests are **not included** in this submission.

### Reasoning:
- The application depends on **PostgreSQL** and **Redis** services running via Docker.
- To avoid introducing environment-specific mocks or conditional logic that could impact production behavior, tests were intentionally omitted.
- The system can be fully validated using API tools such as **Postman** or **curl**.

This approach prioritizes **runtime correctness** and **production stability**.

---

## 🐳 Docker Notes

- All services run in isolated containers.
- Health checks ensure proper startup order.
- Redis is shared across instances for consistent rate limiting.
