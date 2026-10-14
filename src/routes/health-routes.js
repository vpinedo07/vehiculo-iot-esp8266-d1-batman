const { Router } = require("express");
const { asyncHandler } = require("../middleware/async-handler");

function createHealthRouter(database) {
  const router = Router();

  router.get("/health", (request, response) => {
    void request;
    response.json({
      status: "ok",
      service: "vehiculo-iot-api",
      timestamp: new Date().toISOString(),
    });
  });

  router.get(
    "/ready",
    asyncHandler(async (request, response) => {
      void request;
      await database.ping();
      response.json({ status: "ready", database: "connected" });
    }),
  );

  return router;
}

module.exports = { createHealthRouter };
