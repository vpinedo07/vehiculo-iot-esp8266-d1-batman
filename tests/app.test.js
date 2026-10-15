const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const SwaggerParser = require("@apidevtools/swagger-parser");
const { createApp } = require("../src/app");

function createTestApp() {
  const calls = { ping: 0, procedure: 0 };
  const database = {
    async ping() {
      calls.ping += 1;
    },
    async call() {
      calls.procedure += 1;
      return { rows: [], resultSets: [], affectedRows: 0 };
    },
  };

  const config = {
    environment: "test",
    apiPrefix: "/api/v1",
    corsOrigins: ["http://localhost:3000"],
    swaggerWriteEnabled: false,
  };

  return { app: createApp({ database, config }), calls };
}

describe("API", () => {
  test("GET /api/v1/health informa que el servicio está activo", async () => {
    const { app } = createTestApp();
    const response = await request(app).get("/api/v1/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, "ok");
    assert.equal(response.body.service, "vehiculo-iot-api");
  });

  test("GET /api/v1/ready verifica la conexión", async () => {
    const { app, calls } = createTestApp();
    const response = await request(app).get("/api/v1/ready");

    assert.equal(response.status, 200);
    assert.equal(calls.ping, 1);
    assert.equal(response.body.database, "connected");
  });

  test("POST /api/v1/vehiculos rechaza un cuerpo inválido", async () => {
    const { app, calls } = createTestApp();
    const response = await request(app).post("/api/v1/vehiculos").send({});

    assert.equal(response.status, 422);
    assert.equal(response.body.error.code, "VALIDATION_ERROR");
    assert.equal(calls.procedure, 0);
  });

  test("GET /api-docs carga Swagger UI sin consultar la base de datos", async () => {
    const { app, calls } = createTestApp();
    const redirect = await request(app).get("/api-docs");
    const page = await request(app).get("/api-docs/");

    assert.equal(redirect.status, 301);
    assert.equal(redirect.headers.location, "/api-docs/");
    assert.equal(page.status, 200);
    assert.match(page.text, /Swagger UI/);
    assert.equal(calls.ping, 0);
    assert.equal(calls.procedure, 0);
  });

  test("la especificación OpenAPI publica las 23 operaciones existentes", async () => {
    const { app, calls } = createTestApp();
    const response = await request(app).get("/api-docs/openapi.json");

    assert.equal(response.status, 200);
    assert.equal(response.body.openapi, "3.0.3");
    await SwaggerParser.validate(response.body);
    const operations = Object.entries(response.body.paths)
      .flatMap(([path, pathItem]) =>
        Object.keys(pathItem)
          .filter((method) =>
            ["get", "post", "put", "patch", "delete"].includes(method),
          )
          .map((method) => `${method.toUpperCase()} ${path}`),
      )
      .sort();
    const expected = [
      "GET /api/v1/health",
      "GET /api/v1/ready",
      "GET /api/v1/vehiculos",
      "POST /api/v1/vehiculos",
      "GET /api/v1/vehiculos/{id}",
      "PUT /api/v1/vehiculos/{id}",
      "DELETE /api/v1/vehiculos/{id}",
      "GET /api/v1/vehiculos/{vehicleId}/comandos",
      "POST /api/v1/vehiculos/{vehicleId}/comandos",
      "PUT /api/v1/comandos/{id}",
      "DELETE /api/v1/comandos/{id}",
      "GET /api/v1/vehiculos/{vehicleId}/estado",
      "PUT /api/v1/vehiculos/{vehicleId}/estado",
      "GET /api/v1/vehiculos/{vehicleId}/historial",
      "POST /api/v1/vehiculos/{vehicleId}/historial",
      "GET /api/v1/vehiculos/{vehicleId}/demos",
      "POST /api/v1/vehiculos/{vehicleId}/demos",
      "PUT /api/v1/demos/{id}",
      "DELETE /api/v1/demos/{id}",
      "GET /api/v1/demos/{demoId}/movimientos",
      "POST /api/v1/demos/{demoId}/movimientos",
      "PUT /api/v1/demo-movimientos/{id}",
      "DELETE /api/v1/demo-movimientos/{id}",
    ].sort();
    assert.deepEqual(operations, expected);
    assert.ok(response.body.paths["/api/v1/health"].get);
    assert.ok(response.body.paths["/api/v1/ready"].get);
    assert.equal(calls.procedure, 0);
  });

  test("Swagger UI queda en modo de solo lectura cuando así se configura", async () => {
    const { app } = createTestApp();
    const response = await request(app).get("/api-docs/swagger-ui-init.js");

    assert.equal(response.status, 200);
    assert.match(response.text, /"supportedSubmitMethods":\s*\[\s*"get"\s*\]/);
  });

  test("OpenAPI respeta un prefijo de API configurable", async () => {
    const database = {
      ping: async () => {},
      call: async () => ({ rows: [], affectedRows: 0 }),
    };
    const app = createApp({
      database,
      config: {
        environment: "test",
        apiPrefix: "/custom/v2/",
        corsOrigins: ["*"],
        swaggerWriteEnabled: false,
      },
    });
    const response = await request(app).get("/api-docs/openapi.json");

    assert.ok(response.body.paths["/custom/v2/health"]);
    assert.equal(response.body.paths["/api/v1/health"], undefined);
  });
});
