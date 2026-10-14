const { getAppConfig, getDatabaseConfig } = require("./config/environment");
const { Database } = require("./config/database");
const { createApp } = require("./app");

async function startServer() {
  const config = getAppConfig();
  const database = new Database(getDatabaseConfig());

  await database.ping();

  const app = createApp({ database, config });
  const server = app.listen(config.port, "0.0.0.0", () => {
    console.log(
      `Vehículo IoT API disponible en el puerto ${config.port} (${config.environment})`,
    );
  });

  async function shutdown(signal) {
    console.log(`${signal}: cerrando el servidor`);
    server.close(async () => {
      await database.close();
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((error) => {
  console.error("No fue posible iniciar la aplicación", error);
  process.exit(1);
});
