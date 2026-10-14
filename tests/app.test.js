const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
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
});
