const path = require("node:path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function integerFromEnvironment(name, fallback) {
  const value = Number(process.env[name] ?? fallback);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} debe ser un entero positivo`);
  }

  return value;
}

function booleanFromEnvironment(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

function getAppConfig() {
  return {
    environment: process.env.NODE_ENV ?? "development",
    port: integerFromEnvironment("PORT", 3000),
    apiPrefix: process.env.API_PREFIX ?? "/api/v1",
    corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  };
}

function getDatabaseConfig() {
  const sslEnabled = booleanFromEnvironment("DB_SSL");
  const sslCaBase64 = process.env.DB_SSL_CA_BASE64?.trim();

  return {
    host: requiredEnvironment("DB_HOST"),
    port: integerFromEnvironment("DB_PORT", 3306),
    database: requiredEnvironment("DB_NAME"),
    user: requiredEnvironment("DB_USER"),
    password: requiredEnvironment("DB_PASSWORD"),
    waitForConnections: true,
    connectionLimit: integerFromEnvironment("DB_CONNECTION_LIMIT", 10),
    connectTimeout: integerFromEnvironment("DB_CONNECT_TIMEOUT_MS", 10000),
    charset: "utf8mb4",
    timezone: "Z",
    ...(sslEnabled
      ? {
          ssl: {
            rejectUnauthorized: booleanFromEnvironment(
              "DB_SSL_REJECT_UNAUTHORIZED",
              true,
            ),
            ...(sslCaBase64
              ? { ca: Buffer.from(sslCaBase64, "base64").toString("utf8") }
              : {}),
          },
        }
      : {}),
  };
}

module.exports = { getAppConfig, getDatabaseConfig };
