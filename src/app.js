"use strict";

const crypto = require("crypto");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const { body, validationResult } = require("express-validator");
const openApiSpec = require(path.join(__dirname, "openapi.json"));

const app = express();
const jwtSecret = process.env.JWT_SECRET || "dev-only-secret-change-me";

const requireJwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      error: "Missing bearer token",
      requestId: req.requestId,
    });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token",
      requestId: req.requestId,
    });
  }
};

app.disable("x-powered-by");

app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
    },
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  }),
);

app.use(hpp());

app.use(
  express.json({
    limit: "100kb",
    strict: true,
  }),
);

const corsOrigin = process.env.CORS_ORIGIN || "https://example.com";
app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    name: "secure-node-app",
    status: "ok",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get("/docs.json", (req, res) => {
  res.status(200).json(openApiSpec);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.post(
  "/api/auth/token",
  [
    body("name").isString().trim().isLength({ min: 1, max: 100 }),
    body("role").optional().isIn(["viewer", "admin"]),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        errors: errors.array(),
      });
    }

    const token = jwt.sign(
      {
        sub: req.body.name,
        role: req.body.role || "viewer",
      },
      jwtSecret,
      { expiresIn: "1h" },
    );

    return res.status(200).json({ token });
  },
);

app.post(
  "/api/data",
  [
    body("name").isString().trim().escape().isLength({ min: 1, max: 100 }),
    body("email").isEmail().normalizeEmail(),
    body("message")
      .optional()
      .isString()
      .trim()
      .escape()
      .isLength({ max: 500 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        errors: errors.array(),
      });
    }

    return res.status(200).json({
      success: true,
      requestId: req.requestId,
      data: {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message || null,
      },
    });
  },
);

app.get("/api/admin/summary", requireJwtAuth, (req, res) => {
  return res.status(200).json({
    status: "secure",
    message: "Protected portfolio endpoint",
    user: {
      subject: req.user.sub,
      role: req.user.role,
    },
    requestId: req.requestId,
  });
});

app.use((err, req, res, _next) => {
  void _next;
  console.error(err.stack);
  return res.status(500).json({
    error: "Something went wrong",
    requestId: req.requestId,
    ...(process.env.NODE_ENV !== "production" && { details: err.message }),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Resource not found",
    requestId: req.requestId,
  });
});

module.exports = app;
