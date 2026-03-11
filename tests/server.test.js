"use strict";

const request = require("supertest");
const app = require("../src/app");

describe("Server Endpoints", () => {
  it("should return application metadata on GET /", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: "secure-node-app",
        status: "ok",
      }),
    );
  });

  it("should expose health endpoint on GET /healthz", async () => {
    const response = await request(app).get("/healthz");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("healthy");
    expect(response.body).toHaveProperty("timestamp");
  });

  it("should return security and request-id headers", async () => {
    const response = await request(app).get("/");

    expect(response.headers["x-request-id"]).toBeDefined();
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("should validate request body on POST /api/data", async () => {
    const response = await request(app)
      .post("/api/data")
      .send({ name: "", email: "invalid-email" });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Validation failed");
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  it("should accept valid payload on POST /api/data", async () => {
    const payload = {
      name: "Ethan Hammond",
      email: "ethan@example.com",
      message: "Portfolio check",
    };

    const response = await request(app).post("/api/data").send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.requestId).toBeDefined();
    expect(response.body.data).toEqual(
      expect.objectContaining({
        name: payload.name,
        email: payload.email,
      }),
    );
  });

  it("should return structured 404 errors", async () => {
    const response = await request(app).get("/does-not-exist");

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Resource not found");
    expect(response.body.requestId).toBeDefined();
  });

  it("should expose OpenAPI document on GET /docs.json", async () => {
    const response = await request(app).get("/docs.json");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("openapi");
    expect(response.body).toHaveProperty("paths");
  });

  it("should return swagger ui html on GET /docs", async () => {
    const response = await request(app).get("/docs");

    expect(response.statusCode).toBe(301);
    expect(response.headers.location).toBe("/docs/");
  });

  it("should reject protected endpoint without token", async () => {
    const response = await request(app).get("/api/admin/summary");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Missing bearer token");
  });

  it("should issue token and allow protected endpoint", async () => {
    const tokenResponse = await request(app)
      .post("/api/auth/token")
      .send({ name: "Ethan", role: "admin" });

    expect(tokenResponse.statusCode).toBe(200);
    expect(tokenResponse.body.token).toBeDefined();

    const protectedResponse = await request(app)
      .get("/api/admin/summary")
      .set("Authorization", `Bearer ${tokenResponse.body.token}`);

    expect(protectedResponse.statusCode).toBe(200);
    expect(protectedResponse.body.status).toBe("secure");
    expect(protectedResponse.body.user).toEqual(
      expect.objectContaining({
        subject: "Ethan",
        role: "admin",
      }),
    );
  });
});
