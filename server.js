"use strict";

const app = require("./src/app");
const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => {
  console.log(`Secure server listening on port ${port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
