'use strict';

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const { body, validationResult } = require("express-validator"); // Add express-validator for input validation

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Security middleware
// Set security headers with Helmet
app.use(helmet());

// Set Content Security Policy
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
  })
);

// Set up rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(apiLimiter);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Parse JSON requests with size limits to prevent abuse
// Security: Limits request body size to prevent DoS attacks via large payloads
app.use(express.json({ 
  limit: '100kb',  // Restrict JSON body size to 100kb
  strict: true     // Only accept arrays and objects
}));

// Configure CORS with more restrictive defaults
// Security: Restricts which domains can access the API
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'https://example.com', // Default to specific domain instead of wildcard
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Example of a POST endpoint with input validation
// Security: Validates and sanitizes input to prevent injection attacks
app.post("/api/data", [
  body('name').isString().trim().escape().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('message').optional().isString().trim().escape()
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Process validated input
  res.status(200).json({ success: true });
});

// Error handling middleware
// Security: Fixed middleware signature by adding 'next' parameter for proper error handling chain
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong",
    // Don't expose detailed error information in production
    ...(process.env.NODE_ENV !== "production" && { details: err.message }),
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Resource not found" });
});

// Graceful shutdown handler
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Secure server listening on port ${port}`);
});
