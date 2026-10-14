const { z } = require("zod");

const positiveId = z.coerce.number().int().positive();
const nullableDescription = z.string().trim().max(255).nullable().optional();

const idParams = z.object({ id: positiveId });
const vehicleIdParams = z.object({ vehicleId: positiveId });
const demoIdParams = z.object({ demoId: positiveId });

const createVehicle = z.object({
  nombre: z.string().trim().min(1).max(80),
  modelo: z.string().trim().max(80).nullable().optional(),
  descripcion: nullableDescription,
  microcontrolador: z.string().trim().max(50).nullable().optional(),
});

const updateVehicle = createVehicle.extend({
  activo: z.boolean(),
});

const createCommand = z.object({
  nombre: z.string().trim().min(1).max(60),
  codigo: z.number().int(),
  descripcion: nullableDescription,
});

const updateCommand = createCommand.extend({
  activo: z.boolean(),
});

const updateState = z.object({
  id_comando: positiveId.nullable(),
  conectado: z.boolean(),
});

const createHistory = z.object({
  id_comando: positiveId.nullable(),
  origen: z.string().trim().min(1).max(30).default("API"),
});

const createDemo = z.object({
  nombre: z.string().trim().min(1).max(80),
  descripcion: nullableDescription,
});

const updateDemo = createDemo.extend({
  activo: z.boolean(),
});

const movementFields = z.object({
  id_comando: positiveId,
  orden: z.number().int().positive(),
  duracion_ms: z.number().int().nonnegative(),
  pausa_ms: z.number().int().nonnegative().default(0),
});

module.exports = {
  idParams,
  vehicleIdParams,
  demoIdParams,
  createVehicle,
  updateVehicle,
  createCommand,
  updateCommand,
  updateState,
  createHistory,
  createDemo,
  updateDemo,
  createMovement: movementFields,
  updateMovement: movementFields,
};
