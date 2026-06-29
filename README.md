# Gym Access Control System 🏋️‍♂️🔐

![Gym Management System Banner](https://img.shields.io/badge/Status-Active_Development-success)
![Java Spring Boot](https://img.shields.io/badge/Backend-Java_21_%7C_Spring_Boot_3-6DB33F?logo=spring)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_15_App_Router-000000?logo=next.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-336791?logo=postgresql)

Comprehensive user management and personal data protection system for modern gyms. Designed with a dual-interface architecture to solve privacy concerns, separating a public-facing welcome screen from a restricted, high-security administrative dashboard.

## 🏗️ Architecture & Tech Stack

This project follows **Clean Architecture** patterns, ensuring a scalable and maintainable codebase.

### Backend (`/backend`)
- **Java 21** & **Spring Boot 3.x**
- **Data:** Spring Data JPA, PostgreSQL 16
- **Migrations:** Flyway for automated schema versioning
- **Security:** Spring Security (JWT targeting Phase 4)
- **API Documentation:** Swagger UI (OpenAPI 3)

### Frontend (`/frontend`)
- **Next.js 15** (App Router) & React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Shadcn UI (Custom enterprise-grade aesthetics)
- **Icons:** Lucide React

---

## 🚀 Getting Started

Follow these steps to run the complete environment on your local machine.

### 1. Prerequisites
- Java JDK 21 installed.
- Node.js (v18+) and npm installed.
- Docker & Docker Compose (for the database).

### 2. Start the Database
The project includes a ready-to-use Docker configuration for PostgreSQL.
```bash
docker compose up -d
```

### 3. Run the Spring Boot Backend
Navigate to the `backend` directory and use the Maven wrapper to start the server:
```bash
cd backend
./mvnw spring-boot:run
```
*The API will be available at `http://localhost:8080`*
*API Documentation (Swagger) at `http://localhost:8080/swagger-ui.html`*

### 4. Run the Next.js Frontend
Open a **new terminal tab**, navigate to the `frontend` directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
*The application will boot at `http://localhost:3000`*

### 5. Access the Panels
- **Administrative Dashboard:** `http://localhost:3000/reception`

---

## 📅 Roadmap

- [x] **Phase 1 & 2:** Core backend infrastructure, PostgreSQL migrations, and REST API basics.
- [x] **Phase 3:** Frontend initialization, Shadcn UI setup, and secure API bridging (CORS).
- [ ] **Phase 4:** JWT Authentication & Authorization (Login flow).
- [ ] **Phase 5:** Public Welcome Screen & Real-time Access Logs.

---
*Maintained by MamaniMarioOrlando (Tech Lead & Full Stack Architect)*
