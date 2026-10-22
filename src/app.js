const path = require("node:path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const { createOpenApiDocument } = require("./docs/openapi");

const { VehicleRepository } = require("./repositories/vehicle-repository");
const { CommandRepository } = require("./repositories/command-repository");
const { StateRepository } = require("./repositories/state-repository");
const { HistoryRepository } = require("./repositories/history-repository");
const { DemoRepository } = require("./repositories/demo-repository");
const { VehicleService } = require("./services/vehicle-service");
const { CommandService } = require("./services/command-service");
const { StateService } = require("./services/state-service");
const { HistoryService } = require("./services/history-service");
const { DemoService } = require("./services/demo-service");
const { VehicleController } = require("./controllers/vehicle-controller");
const { CommandController } = require("./controllers/command-controller");
const { StateController } = require("./controllers/state-controller");
const { HistoryController } = require("./controllers/history-controller");
const { DemoController } = require("./controllers/demo-controller");
const { createHealthRouter } = require("./routes/health-routes");
const { createVehicleRouter } = require("./routes/vehicle-routes");
const { createCommandRouter } = require("./routes/command-routes");
const { createStateRouter } = require("./routes/state-routes");
const { createHistoryRouter } = require("./routes/history-routes");
const { createDemoRouter } = require("./routes/demo-routes");
const { errorHandler, notFoundHandler } = require("./middleware/error-handler");

function buildDependencies(database) {
  const vehicleRepository = new VehicleRepository(database);
  const commandRepository = new CommandRepository(database);
  const stateRepository = new StateRepository(database);
  const historyRepository = new HistoryRepository(database);
  const demoRepository = new DemoRepository(database);

  return {
    vehicleController: new VehicleController(
      new VehicleService(vehicleRepository),
    ),
    commandController: new CommandController(
      new CommandService(commandRepository, vehicleRepository),
    ),
    stateController: new StateController(
      new StateService(stateRepository, vehicleRepository),
    ),
    historyController: new HistoryController(
      new HistoryService(historyRepository, vehicleRepository),
    ),
    demoController: new DemoController(
      new DemoService(demoRepository, vehicleRepository),
    ),
  };
}

function createApp({ database, config }) {
  const app = express();
  const controllers = buildDependencies(database);

  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin(origin, callback) {
        const allowed =
          !origin ||
          config.corsOrigins.includes("*") ||
          config.corsOrigins.includes(origin);
        callback(
          allowed ? null : new Error("Origen no permitido por CORS"),
          allowed,
        );
      },
    }),
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(morgan(config.environment === "production" ? "combined" : "dev"));

  app.get("/", (request, response) => {
    void request;
    response.sendFile(path.resolve(process.cwd(), "index.html"));
  });

  const openApiDocument = createOpenApiDocument(config.apiPrefix);
  app.get("/api-docs/openapi.json", (request, response) => {
    void request;
    response.json(openApiDocument);
  });
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customSiteTitle: "Vehículo IoT API | Swagger UI",
      customCss: ".swagger-ui .topbar { background-color: #111827; }",
      swaggerOptions: {
        docExpansion: "list",
        filter: true,
        displayRequestDuration: true,
        operationsSorter: "method",
        supportedSubmitMethods: ["get", "put"],  // config.swaggerWriteEnabled           ? ["get", "post", "put", "patch", "delete"]           : ["get"],
      },
    }),
  );

  app.use(config.apiPrefix, createHealthRouter(database));
  app.use(config.apiPrefix, createVehicleRouter(controllers.vehicleController));
  app.use(config.apiPrefix, createCommandRouter(controllers.commandController));
  app.use(config.apiPrefix, createStateRouter(controllers.stateController));
  app.use(config.apiPrefix, createHistoryRouter(controllers.historyController));
  app.use(config.apiPrefix, createDemoRouter(controllers.demoController));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
