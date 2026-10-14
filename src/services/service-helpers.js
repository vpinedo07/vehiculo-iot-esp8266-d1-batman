const { NotFoundError } = require("../errors/app-error");

function firstRowOrFail(result, resource) {
  const row = result.rows[0];
  if (!row) throw new NotFoundError(resource);
  return row;
}

function affectedOrFail(result, resource) {
  if (result.affectedRows === 0) throw new NotFoundError(resource);
}

async function ensureVehicleExists(vehicleRepository, vehicleId) {
  const result = await vehicleRepository.findById(vehicleId);
  firstRowOrFail(result, "Vehículo");
}

module.exports = { firstRowOrFail, affectedOrFail, ensureVehicleExists };
