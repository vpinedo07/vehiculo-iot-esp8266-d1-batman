const TAGS = [
  ["Health", "Salud y disponibilidad del servicio"],
  ["Vehículos", "Administración de vehículos IoT"],
  ["Comandos", "Comandos configurados para cada vehículo"],
  ["Estado", "Estado actual de conexión y último comando"],
  ["Historial", "Registro de comandos ejecutados"],
  ["DEMOS", "Secuencias demostrativas de un vehículo"],
  ["Movimientos de DEMO", "Movimientos que componen una demo"],
];

const errorResponse = (description) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
      example: {
        error: {
          code: "VALIDATION_ERROR",
          message: "La solicitud contiene datos inválidos",
          details: [{ field: "body.nombre", message: "Too small" }],
        },
      },
    },
  },
});

const jsonResponse = (description, schema, example) => ({
  description,
  content: { "application/json": { schema, example } },
});

const idParameter = (name, description) => ({
  name,
  in: "path",
  required: true,
  description,
  schema: { type: "integer", minimum: 1 },
  example: 1,
});

const body = (
  schema,
  example,
  description = "Datos requeridos para la operación",
) => ({
  required: true,
  description,
  content: {
    "application/json": {
      schema: { $ref: `#/components/schemas/${schema}` },
      example,
    },
  },
});

const commonErrors = {
  422: errorResponse("La ruta o el cuerpo no cumple las validaciones"),
  500: errorResponse("Error interno del servidor"),
  503: errorResponse("La base de datos no está disponible"),
};
const notFound = errorResponse("El recurso solicitado no existe");
const conflicts = {
  409: errorResponse("Registro duplicado o conflicto entre relaciones"),
};

function createOpenApiDocument(apiPrefix = "/api/v1") {
  const prefix = `/${String(apiPrefix).replace(/^\/+|\/+$/g, "")}`;
  const p = (path) => `${prefix}${path}`;
  const vehicleId = idParameter("vehicleId", "Identificador del vehículo");
  const id = (resource) => idParameter("id", `Identificador de ${resource}`);
  const demoId = idParameter("demoId", "Identificador de la demo");
  const message = (value) =>
    jsonResponse(
      "Operación completada",
      { $ref: "#/components/schemas/MessageResponse" },
      { message: value },
    );
  const list = (name, example) =>
    jsonResponse(
      "Listado obtenido",
      {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "array",
            items: { $ref: `#/components/schemas/${name}` },
          },
        },
      },
      { data: example },
    );
  const item = (name, example, description = "Recurso obtenido") =>
    jsonResponse(
      description,
      {
        type: "object",
        required: ["data"],
        properties: { data: { $ref: `#/components/schemas/${name}` } },
      },
      { data: example },
    );

  const vehicleExample = {
    id_vehiculo: 1,
    nombre: "Batimóvil D1",
    modelo: "ESP8266",
    descripcion: "Vehículo IoT de demostración",
    microcontrolador: "Wemos D1",
    activo: true,
  };
  const commandExample = {
    id_comando: 1,
    id_vehiculo: 1,
    nombre: "Avanzar",
    codigo: 1,
    descripcion: "Avanza en línea recta",
    activo: true,
  };
  const stateExample = {
    id_estado: 1,
    id_vehiculo: 1,
    id_comando: 1,
    conectado: true,
    fecha_actualizacion: "2026-10-14T18:30:00.000Z",
  };
  const historyExample = {
    id_historial: 1,
    id_vehiculo: 1,
    id_comando: 1,
    origen: "API",
    fecha_ejecucion: "2026-10-14T18:30:00.000Z",
  };
  const demoExample = {
    id_demo: 1,
    id_vehiculo: 1,
    nombre: "Recorrido básico",
    descripcion: "Avanza y gira",
    activo: true,
  };
  const movementExample = {
    id_movimiento: 1,
    id_demo: 1,
    id_comando: 1,
    orden: 1,
    duracion_ms: 1500,
    pausa_ms: 250,
  };

  return {
    openapi: "3.0.3",
    info: {
      title: "Vehículo IoT API",
      version: "1.0.0",
      description:
        "API REST para la administración y control de vehículos IoT mediante Node.js, Express y MySQL. En producción, Swagger UI permite ejecutar únicamente operaciones GET por defecto. Habilitar escrituras requiere configurar explícitamente SWAGGER_WRITE_ENABLED=true; esas operaciones pueden modificar o eliminar información real.",
    },
    servers: [
      { url: "http://localhost:3000", description: "Desarrollo local" },
      {
        url: "https://vehiculo-iot-esp8266-d1.kadasofsolutions.com",
        description: "Producción",
      },
    ],
    tags: TAGS.map(([name, description]) => ({ name, description })),
    paths: {
      [p("/health")]: {
        get: {
          tags: ["Health"],
          summary: "Consultar salud del servicio",
          description: "Confirma que el proceso de la API está activo.",
          responses: {
            200: jsonResponse(
              "Servicio activo",
              { $ref: "#/components/schemas/Health" },
              {
                status: "ok",
                service: "vehiculo-iot-api",
                timestamp: "2026-10-14T18:30:00.000Z",
              },
            ),
            500: commonErrors["500"],
          },
        },
      },
      [p("/ready")]: {
        get: {
          tags: ["Health"],
          summary: "Consultar disponibilidad",
          description: "Comprueba la conexión con la base de datos.",
          responses: {
            200: jsonResponse(
              "API y base de datos disponibles",
              { $ref: "#/components/schemas/Ready" },
              { status: "ready", database: "connected" },
            ),
            503: commonErrors["503"],
            500: commonErrors["500"],
          },
        },
      },
      [p("/vehiculos")]: {
        get: {
          tags: ["Vehículos"],
          summary: "Listar vehículos",
          responses: {
            200: list("Vehicle", [vehicleExample]),
            500: commonErrors["500"],
            503: commonErrors["503"],
          },
        },
        post: {
          tags: ["Vehículos"],
          summary: "Crear vehículo",
          requestBody: body("CreateVehicle", {
            nombre: "Batimóvil D1",
            modelo: "ESP8266",
            descripcion: "Vehículo IoT de demostración",
            microcontrolador: "Wemos D1",
          }),
          responses: {
            201: item("Vehicle", vehicleExample, "Vehículo creado"),
            ...commonErrors,
            ...conflicts,
          },
        },
      },
      [p("/vehiculos/{id}")]: {
        get: {
          tags: ["Vehículos"],
          summary: "Obtener vehículo",
          parameters: [id("vehículo")],
          responses: {
            200: item("Vehicle", vehicleExample),
            404: notFound,
            ...commonErrors,
          },
        },
        put: {
          tags: ["Vehículos"],
          summary: "Actualizar vehículo",
          parameters: [id("vehículo")],
          requestBody: body("UpdateVehicle", {
            nombre: "Batimóvil D1",
            modelo: "ESP8266",
            descripcion: "Vehículo actualizado",
            microcontrolador: "Wemos D1",
            activo: true,
          }),
          responses: {
            200: message("Vehículo actualizado correctamente"),
            404: notFound,
            ...commonErrors,
            ...conflicts,
          },
        },
        delete: {
          tags: ["Vehículos"],
          summary: "Eliminar vehículo",
          parameters: [id("vehículo")],
          responses: {
            204: { description: "Vehículo eliminado; respuesta sin cuerpo" },
            404: notFound,
            409: conflicts["409"],
            500: commonErrors["500"],
            503: commonErrors["503"],
          },
        },
      },
      [p("/vehiculos/{vehicleId}/comandos")]: {
        get: {
          tags: ["Comandos"],
          summary: "Listar comandos del vehículo",
          parameters: [vehicleId],
          responses: {
            200: list("Command", [commandExample]),
            404: notFound,
            ...commonErrors,
          },
        },
        post: {
          tags: ["Comandos"],
          summary: "Crear comando",
          parameters: [vehicleId],
          requestBody: body("CreateCommand", {
            nombre: "Avanzar",
            codigo: 1,
            descripcion: "Avanza en línea recta",
          }),
          responses: {
            201: item("Command", commandExample, "Comando creado"),
            404: notFound,
            ...commonErrors,
            ...conflicts,
          },
        },
      },
      [p("/comandos/{id}")]: {
        put: {
          tags: ["Comandos"],
          summary: "Actualizar comando",
          parameters: [id("comando")],
          requestBody: body("UpdateCommand", {
            nombre: "Avanzar",
            codigo: 1,
            descripcion: "Avanza en línea recta",
            activo: true,
          }),
          responses: {
            200: message("Comando actualizado correctamente"),
            404: notFound,
            ...commonErrors,
            ...conflicts,
          },
        },
        delete: {
          tags: ["Comandos"],
          summary: "Eliminar comando",
          parameters: [id("comando")],
          responses: {
            204: { description: "Comando eliminado; respuesta sin cuerpo" },
            404: notFound,
            409: conflicts["409"],
            500: commonErrors["500"],
            503: commonErrors["503"],
          },
        },
      },
      [p("/vehiculos/{vehicleId}/estado")]: {
        get: {
          tags: ["Estado"],
          summary: "Obtener estado del vehículo",
          parameters: [vehicleId],
          responses: {
            200: item("VehicleState", stateExample),
            404: notFound,
            ...commonErrors,
          },
        },
        put: {
          tags: ["Estado"],
          summary: "Actualizar estado del vehículo",
          parameters: [vehicleId],
          requestBody: body("UpdateState", { id_comando: 1, conectado: true }),
          responses: {
            200: message("Estado actualizado correctamente"),
            404: notFound,
            ...commonErrors,
            ...conflicts,
          },
        },
      },
      [p("/vehiculos/{vehicleId}/historial")]: {
        get: {
          tags: ["Historial"],
          summary: "Listar historial del vehículo",
          parameters: [vehicleId],
          responses: {
            200: list("History", [historyExample]),
            404: notFound,
            ...commonErrors,
          },
        },
        post: {
          tags: ["Historial"],
          summary: "Registrar historial",
          parameters: [vehicleId],
          requestBody: body("CreateHistory", { id_comando: 1, origen: "API" }),
          responses: {
            201: message("Historial registrado correctamente"),
            404: notFound,
            ...commonErrors,
            ...conflicts,
          },
        },
      },
      [p("/vehiculos/{vehicleId}/demos")]: {
        get: {
          tags: ["DEMOS"],
          summary: "Listar demos del vehículo",
          parameters: [vehicleId],
          responses: {
            200: list("Demo", [demoExample]),
            404: notFound,
            ...commonErrors,
          },
        },
        post: {
          tags: ["DEMOS"],
          summary: "Crear demo",
          parameters: [vehicleId],
          requestBody: body("CreateDemo", {
            nombre: "Recorrido básico",
            descripcion: "Avanza y gira",
          }),
          responses: {
            201: item("Demo", demoExample, "Demo creada"),
            404: notFound,
            ...commonErrors,
            ...conflicts,
          },
        },
      },
      [p("/demos/{id}")]: {
        put: {
          tags: ["DEMOS"],
          summary: "Actualizar demo",
          parameters: [id("demo")],
          requestBody: body("UpdateDemo", {
            nombre: "Recorrido básico",
            descripcion: "Avanza y gira",
            activo: true,
          }),
          responses: {
            200: message("Demo actualizada correctamente"),
            404: notFound,
            ...commonErrors,
            ...conflicts,
          },
        },
        delete: {
          tags: ["DEMOS"],
          summary: "Eliminar demo",
          parameters: [id("demo")],
          responses: {
            204: { description: "Demo eliminada; respuesta sin cuerpo" },
            404: notFound,
            409: conflicts["409"],
            500: commonErrors["500"],
            503: commonErrors["503"],
          },
        },
      },
      [p("/demos/{demoId}/movimientos")]: {
        get: {
          tags: ["Movimientos de DEMO"],
          summary: "Listar movimientos de una demo",
          parameters: [demoId],
          responses: {
            200: list("DemoMovement", [movementExample]),
            ...commonErrors,
          },
        },
        post: {
          tags: ["Movimientos de DEMO"],
          summary: "Agregar movimiento a una demo",
          parameters: [demoId],
          requestBody: body("MovementInput", {
            id_comando: 1,
            orden: 1,
            duracion_ms: 1500,
            pausa_ms: 250,
          }),
          responses: {
            201: message("Movimiento agregado correctamente"),
            ...commonErrors,
            ...conflicts,
          },
        },
      },
      [p("/demo-movimientos/{id}")]: {
        put: {
          tags: ["Movimientos de DEMO"],
          summary: "Actualizar movimiento de demo",
          parameters: [id("movimiento")],
          requestBody: body("MovementInput", {
            id_comando: 1,
            orden: 1,
            duracion_ms: 2000,
            pausa_ms: 250,
          }),
          responses: {
            200: message("Movimiento actualizado correctamente"),
            404: notFound,
            ...commonErrors,
            ...conflicts,
          },
        },
        delete: {
          tags: ["Movimientos de DEMO"],
          summary: "Eliminar movimiento de demo",
          parameters: [id("movimiento")],
          responses: {
            204: { description: "Movimiento eliminado; respuesta sin cuerpo" },
            404: notFound,
            409: conflicts["409"],
            500: commonErrors["500"],
            503: commonErrors["503"],
          },
        },
      },
    },
    components: { schemas: createSchemas() },
  };
}

function createSchemas() {
  const nullableText = (maxLength) => ({
    type: "string",
    maxLength,
    nullable: true,
  });
  const active = {
    type: "boolean",
    description: "Indica si el registro está activo",
  };
  return {
    ErrorResponse: {
      type: "object",
      required: ["error"],
      properties: {
        error: {
          type: "object",
          required: ["code", "message"],
          properties: {
            code: { type: "string", example: "VALIDATION_ERROR" },
            message: { type: "string" },
            details: {
              type: "array",
              items: {
                type: "object",
                required: ["field", "message"],
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    MessageResponse: {
      type: "object",
      required: ["message"],
      properties: { message: { type: "string" } },
    },
    Health: {
      type: "object",
      required: ["status", "service", "timestamp"],
      properties: {
        status: { type: "string", enum: ["ok"] },
        service: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
      },
    },
    Ready: {
      type: "object",
      required: ["status", "database"],
      properties: {
        status: { type: "string", enum: ["ready"] },
        database: { type: "string", enum: ["connected"] },
      },
    },
    CreateVehicle: {
      type: "object",
      additionalProperties: false,
      required: ["nombre"],
      properties: {
        nombre: { type: "string", minLength: 1, maxLength: 80 },
        modelo: nullableText(80),
        descripcion: nullableText(255),
        microcontrolador: nullableText(50),
      },
    },
    UpdateVehicle: {
      allOf: [
        { $ref: "#/components/schemas/CreateVehicle" },
        {
          type: "object",
          required: ["activo"],
          properties: { activo: active },
        },
      ],
    },
    Vehicle: {
      allOf: [
        { $ref: "#/components/schemas/UpdateVehicle" },
        {
          type: "object",
          properties: { id_vehiculo: { type: "integer", minimum: 1 } },
        },
      ],
    },
    CreateCommand: {
      type: "object",
      additionalProperties: false,
      required: ["nombre", "codigo"],
      properties: {
        nombre: { type: "string", minLength: 1, maxLength: 60 },
        codigo: { type: "integer" },
        descripcion: nullableText(255),
      },
    },
    UpdateCommand: {
      allOf: [
        { $ref: "#/components/schemas/CreateCommand" },
        {
          type: "object",
          required: ["activo"],
          properties: { activo: active },
        },
      ],
    },
    Command: {
      allOf: [
        { $ref: "#/components/schemas/UpdateCommand" },
        {
          type: "object",
          properties: {
            id_comando: { type: "integer", minimum: 1 },
            id_vehiculo: { type: "integer", minimum: 1 },
          },
        },
      ],
    },
    UpdateState: {
      type: "object",
      additionalProperties: false,
      required: ["id_comando", "conectado"],
      properties: {
        id_comando: { type: "integer", minimum: 1, nullable: true },
        conectado: { type: "boolean" },
      },
    },
    VehicleState: {
      allOf: [
        { $ref: "#/components/schemas/UpdateState" },
        {
          type: "object",
          properties: {
            id_estado: { type: "integer" },
            id_vehiculo: { type: "integer" },
            fecha_actualizacion: { type: "string", format: "date-time" },
          },
        },
      ],
    },
    CreateHistory: {
      type: "object",
      additionalProperties: false,
      required: ["id_comando"],
      properties: {
        id_comando: { type: "integer", minimum: 1, nullable: true },
        origen: { type: "string", minLength: 1, maxLength: 30, default: "API" },
      },
    },
    History: {
      allOf: [
        { $ref: "#/components/schemas/CreateHistory" },
        {
          type: "object",
          properties: {
            id_historial: { type: "integer" },
            id_vehiculo: { type: "integer" },
            fecha_ejecucion: { type: "string", format: "date-time" },
          },
        },
      ],
    },
    CreateDemo: {
      type: "object",
      additionalProperties: false,
      required: ["nombre"],
      properties: {
        nombre: { type: "string", minLength: 1, maxLength: 80 },
        descripcion: nullableText(255),
      },
    },
    UpdateDemo: {
      allOf: [
        { $ref: "#/components/schemas/CreateDemo" },
        {
          type: "object",
          required: ["activo"],
          properties: { activo: active },
        },
      ],
    },
    Demo: {
      allOf: [
        { $ref: "#/components/schemas/UpdateDemo" },
        {
          type: "object",
          properties: {
            id_demo: { type: "integer" },
            id_vehiculo: { type: "integer" },
          },
        },
      ],
    },
    MovementInput: {
      type: "object",
      additionalProperties: false,
      required: ["id_comando", "orden", "duracion_ms"],
      properties: {
        id_comando: { type: "integer", minimum: 1 },
        orden: { type: "integer", minimum: 1 },
        duracion_ms: { type: "integer", minimum: 0 },
        pausa_ms: { type: "integer", minimum: 0, default: 0 },
      },
    },
    DemoMovement: {
      allOf: [
        { $ref: "#/components/schemas/MovementInput" },
        {
          type: "object",
          properties: {
            id_movimiento: { type: "integer" },
            id_demo: { type: "integer" },
          },
        },
      ],
    },
  };
}

module.exports = { createOpenApiDocument };
