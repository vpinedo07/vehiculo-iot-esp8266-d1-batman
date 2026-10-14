const { affectedOrFail, ensureVehicleExists } = require("./service-helpers");

class CommandService {
  constructor(commandRepository, vehicleRepository) {
    this.commandRepository = commandRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async create(vehicleId, data) {
    await ensureVehicleExists(this.vehicleRepository, vehicleId);
    const result = await this.commandRepository.create(vehicleId, data);
    return result.rows[0];
  }

  async findByVehicle(vehicleId) {
    await ensureVehicleExists(this.vehicleRepository, vehicleId);
    const result = await this.commandRepository.findByVehicle(vehicleId);
    return result.rows;
  }

  async update(id, data) {
    const result = await this.commandRepository.update(id, data);
    affectedOrFail(result, "Comando");
  }

  async delete(id) {
    const result = await this.commandRepository.delete(id);
    affectedOrFail(result, "Comando");
  }
}

module.exports = { CommandService };
