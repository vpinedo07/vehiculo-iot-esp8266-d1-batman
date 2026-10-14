# Vehículo IoT API

API REST en Node.js para administrar vehículos, comandos, estado, historial y
secuencias DEMO almacenadas en MySQL.

La aplicación usa los 21 procedimientos almacenados existentes. No crea ni
modifica tablas, relaciones o procedimientos.

## Arquitectura

```text
Ruta -> Controlador -> Servicio -> Repositorio -> Stored Procedure -> MySQL
```

- **Routes:** rutas HTTP y validación de solicitudes.
- **Controllers:** adaptación entre HTTP y los casos de uso.
- **Services:** reglas de aplicación y comprobaciones.
- **Repositories:** llamadas a los Stored Procedures.
- **Config:** variables de entorno y pool de conexiones.

## Requisitos

- Node.js 20 o superior.
- Acceso remoto a la base de datos MySQL de Hostinger.
- Base de datos `vehiculo_iot` con sus seis tablas y 21 SP instalados.

## Configuración local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` como `.env` y coloca tus credenciales. Nunca subas
   `.env` a GitHub.

3. En Hostinger, autoriza la IP desde la que se conectará la aplicación si la
   base de datos tiene una lista de acceso remoto.

4. Ejecuta:

   ```bash
   npm run dev
   ```

La aplicación queda disponible en `http://localhost:3000`.

## Despliegue en Hostinger

Configura las variables de `.env.example` en el panel de la aplicación
Node.js. El archivo de inicio es `server.js` y el comando es `npm start`.
Usa el host MySQL que proporciona Hostinger; no uses `localhost` salvo que la
aplicación y MySQL estén realmente en el mismo servidor.

Si Hostinger exige TLS, establece `DB_SSL=true`. Cuando proporcione un
certificado CA, codifícalo en Base64 y guárdalo en `DB_SSL_CA_BASE64`.

## Endpoints

Todos los endpoints de datos usan el prefijo `/api/v1`.

| Método | Ruta                              | Operación             |
| ------ | --------------------------------- | --------------------- |
| GET    | `/health`                         | Estado del proceso    |
| GET    | `/ready`                          | Estado de MySQL       |
| POST   | `/vehiculos`                      | Crear vehículo        |
| GET    | `/vehiculos`                      | Listar vehículos      |
| GET    | `/vehiculos/:id`                  | Obtener vehículo      |
| PUT    | `/vehiculos/:id`                  | Actualizar vehículo   |
| DELETE | `/vehiculos/:id`                  | Eliminar vehículo     |
| POST   | `/vehiculos/:vehicleId/comandos`  | Crear comando         |
| GET    | `/vehiculos/:vehicleId/comandos`  | Listar comandos       |
| PUT    | `/comandos/:id`                   | Actualizar comando    |
| DELETE | `/comandos/:id`                   | Eliminar comando      |
| PUT    | `/vehiculos/:vehicleId/estado`    | Actualizar estado     |
| GET    | `/vehiculos/:vehicleId/estado`    | Consultar estado      |
| POST   | `/vehiculos/:vehicleId/historial` | Registrar historial   |
| GET    | `/vehiculos/:vehicleId/historial` | Consultar historial   |
| POST   | `/vehiculos/:vehicleId/demos`     | Crear demo            |
| GET    | `/vehiculos/:vehicleId/demos`     | Listar demos          |
| PUT    | `/demos/:id`                      | Actualizar demo       |
| DELETE | `/demos/:id`                      | Eliminar demo         |
| POST   | `/demos/:demoId/movimientos`      | Agregar movimiento    |
| GET    | `/demos/:demoId/movimientos`      | Listar movimientos    |
| PUT    | `/demo-movimientos/:id`           | Actualizar movimiento |
| DELETE | `/demo-movimientos/:id`           | Eliminar movimiento   |

## Calidad

```bash
npm test
npm run lint
npm run format:check
```

Antes de probar endpoints de datos, consulta `GET /api/v1/ready`. Una
respuesta `503` normalmente indica credenciales incorrectas, acceso remoto no
autorizado o un host/puerto incorrecto.
