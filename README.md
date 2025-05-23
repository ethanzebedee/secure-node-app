# Secure Node App

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ethanzebedee/CI-CD-Pipeline/ci.yml?branch=main)
![Docker Pulls](https://img.shields.io/badge/docker-ready-blue)
![Code Style](https://img.shields.io/badge/code%20style-eslint-brightgreen)
![Testing](https://img.shields.io/badge/tests-jest-red)

A secure Node.js application demonstrating best practices in authentication, authorization, and CI/CD integration.

---

## 📋 Table of Contents

- [🛠️ Technologies](#-technologies)
- [🔐 Security Features](#-security-features)
- [🔄 CI/CD Integration](#-cicd-integration)
- [🚀 Setup and Installation](#-setup-and-installation)
- [🧪 Testing Strategy](#-testing-strategy)
- [🐳 Docker Containerization](#-docker-containerization)
- [🔮 Future Improvements](#-future-improvements)

---

## 🛠️ Technologies

- **Node.js** – JavaScript runtime
- **Express** – Web framework
- **MongoDB + Mongoose** – NoSQL database and modeling
- **JWT + bcrypt** – Authentication and password hashing
- **Helmet** – Secure HTTP headers
- **dotenv** – Environment configuration
- **Jest + Supertest** – Testing
- **ESLint** – Code style enforcement
- **Docker** – Containerization

---

## 🔐 Security Features

This application includes multiple security enhancements:

- 🔑 **Authentication** – JWT-based user auth
- 🛡️ **Authorization** – Role-based access control
- 🧂 **Hashed Passwords** – bcrypt for secure storage
- 🧢 **HTTP Headers** – Secured with Helmet
- 🔒 **Env Configs** – Secrets managed via `.env`

---

## 🔄 CI/CD Integration

This project integrates directly with the [CI-CD-Pipeline](https://github.com/ethanzebedee/CI-CD-Pipeline), which:

- Automates **linting**, **testing**, and **Docker builds** on every push
- Utilizes **GitHub Actions** to validate code quality
- Ensures repeatable, secure deployments with Docker

The GitHub Actions workflow (`ci.yml`) from the CI-CD-Pipeline project has been adapted to validate and build this application.

---

## 🚀 Setup and Installation

### Prerequisites

- Node.js (v14+)
- MongoDB
- Docker (optional)

### Local Setup

```bash
git clone https://github.com/ethanzebedee/secure-node-app.git
cd secure-node-app
npm install
cp .env.example .env  # Update your secrets
npm start

```

## 🧪 Testing Strategy

```bash
# Run tests
npm test

# Lint the code
npm run lint
```

**Test coverage includes:**

- ✅ Unit tests (functions, auth)
- ✅ Integration tests (API endpoints)
- ✅ CI validation with Jest and ESLint

---

## 🐳 Docker Containerization

```bash
# Build the image
docker build -t secure-node-app .

# Run the container
docker run -p 3000:3000 secure-node-app
```

**Docker best practices are followed:**

- 🧱 Multi-stage build
- 🐋 Minimal base image (Alpine)
- 📄 `.dockerignore` for lean builds

---

## 🔮 Future Improvements

- 🔁 Add staging/production deployment pipelines
- 📈 Integrate code coverage and reporting
- 🔍 Add security auditing tools
- ☁️ Connect to cloud platforms for deployment

---

Built with 💻 by [Ethan Zebedee](https://github.com/ethanzebedee)
