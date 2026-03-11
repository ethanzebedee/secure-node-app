# Secure Node App

![CI](https://img.shields.io/github/actions/workflow/status/ethanzebedee/secure-node-app/ci.yml?branch=main&label=ci)
![Node](https://img.shields.io/badge/node-%3E%3D20-0a7b2d)
![Express](https://img.shields.io/badge/express-5.x-black)
![Security](https://img.shields.io/badge/security-hardened-blue)
![Tests](https://img.shields.io/badge/tests-jest%20%2B%20supertest-c62828)

Security-focused Express API designed as a portfolio-ready backend sample.

The app demonstrates practical API hardening, defensive middleware, structured error handling, and integration tests that validate real behavior rather than mocked routes.

## Highlights

- Security headers via Helmet (including explicit CSP)
- Global rate limiting to reduce brute-force and abuse risk
- CORS restrictions with configurable allowed origin
- HTTP parameter pollution protection via HPP
- Strict JSON parsing with payload size limits
- Input validation and sanitization with express-validator
- Request correlation with X-Request-Id header
- Structured JSON errors (validation, 404, 500)
- Interactive API docs with OpenAPI + Swagger UI
- JWT auth flow with protected endpoint example
- Graceful shutdown handling for SIGTERM and SIGINT
- Multi-stage Docker build with non-root runtime user

## API Endpoints

- `GET /` returns service metadata
- `GET /healthz` returns health, uptime, and timestamp
- `GET /docs` opens interactive Swagger docs
- `GET /docs.json` serves the OpenAPI document
- `POST /api/auth/token` issues a short-lived demo JWT
- `POST /api/data` validates and sanitizes `name`, `email`, and optional `message`
- `GET /api/admin/summary` requires JWT bearer token

Example success response for `POST /api/data`:

```json
{
  "success": true,
  "requestId": "4e6f8555-8696-4918-9ac2-0b8ae05f8de8",
  "data": {
    "name": "Ethan Hammond",
    "email": "ethan@example.com",
    "message": "Portfolio check"
  }
}
```

## Project Structure

```text
.
├── src/
│   └── app.js            # Express app, middleware, and routes
├── tests/
│   └── server.test.js    # Integration tests with Supertest
├── Dockerfile
├── server.js             # Process bootstrap and graceful shutdown
└── security-checklist.md
```

## Run Locally

```bash
npm install
npm start
```

Default port is `3000`.

Optional environment variables:

- `PORT` (default: `3000`)
- `NODE_ENV` (example: `production`)
- `CORS_ORIGIN` (default: `https://example.com`)
- `JWT_SECRET` (default: `dev-only-secret-change-me`)

## API Docs

After starting the app, open:

- `http://localhost:3000/docs` for Swagger UI
- `http://localhost:3000/docs.json` for raw OpenAPI JSON

You can use the Swagger UI to run requests directly and test the auth flow.

## JWT Auth Demo

```bash
# 1) Get a token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"name":"Ethan","role":"admin"}' | jq -r .token)

# 2) Call protected endpoint
curl -s http://localhost:3000/api/admin/summary \
  -H "Authorization: Bearer $TOKEN"
```

## Test and Lint

```bash
npm test
npm run test:coverage
npm run lint
```

## Docker

```bash
npm run docker:build
docker run --rm -p 3000:3000 secure-node-app:latest
```

Health check endpoint used by container:

- `GET /healthz`

## Why This Is Portfolio-Worthy

- This is the kind of backend I would actually show in an interview: secure defaults, clear structure, and docs people can run immediately.
- The tests hit real app behavior, so it proves the middleware and endpoints actually work instead of just looking good on paper.
- Splitting app setup from process startup keeps the code easier to maintain and closer to how production services are usually organized.

Built by [Ethan Zebedee](https://github.com/ethanzebedee)
