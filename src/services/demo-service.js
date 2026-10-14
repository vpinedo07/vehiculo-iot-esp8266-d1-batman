const { affectedOrFail, ensureVehicleExists } = require("./service-helpers");

class DemoService {
  constructor(demoRepository, vehicleRepository) {
    this.demoRepository = demoRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async create(vehicleId, data) {
    await ensureVehicleExists(this.vehicleRepository, vehicleId);
    const result = await this.demoRepository.create(vehicleId, data);
    return result.rows[0];
  }

  async findByVehicle(vehicleId) {
    await ensureVehicleExists(this.vehicleRepository, vehicleId);
    const result = await this.demoRepository.findByVehicle(vehicleId);
    return result.rows;
  }

  async update(id, data) {
    const result = await this.demoRepository.update(id, data);
    affectedOrFail(result, "Demo");
  }

  async delete(id) {
    const result = await this.demoRepository.delete(id);
    affectedOrFail(result, "Demo");
  }

  async addMovement(demoId, data) {
    await this.demoRepository.addMovement(demoId, data);
  }

  async findMovements(demoId) {
    const result = await this.demoRepository.findMovements(demoId);
    return result.rows;
  }

  async updateMovement(id, data) {
    const result = await this.demoRepository.updateMovement(id, data);
    affectedOrFail(result, "Movimiento de demo");
  }

  async deleteMovement(id) {
    const result = await this.demoRepository.deleteMovement(id);
    affectedOrFail(result, "Movimiento de demo");
  }
}

module.exports = { DemoService };
