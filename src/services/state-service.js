const { firstRowOrFail, ensureVehicleExists } = require("./service-helpers");

class StateService {
  constructor(stateRepository, vehicleRepository) {
    this.stateRepository = stateRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async update(vehicleId, data) {
    await ensureVehicleExists(this.vehicleRepository, vehicleId);
    await this.stateRepository.update(vehicleId, data);
  }

  async findByVehicle(vehicleId) {
    await ensureVehicleExists(this.vehicleRepository, vehicleId);
    const result = await this.stateRepository.findByVehicle(vehicleId);
    return firstRowOrFail(result, "Estado del vehículo");
  }
}

module.exports = { StateService };
