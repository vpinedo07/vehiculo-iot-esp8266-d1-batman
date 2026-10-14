const { firstRowOrFail, affectedOrFail } = require("./service-helpers");

class VehicleService {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async create(data) {
    const result = await this.vehicleRepository.create(data);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.vehicleRepository.findAll();
    return result.rows;
  }

  async findById(id) {
    const result = await this.vehicleRepository.findById(id);
    return firstRowOrFail(result, "Vehículo");
  }

  async update(id, data) {
    await this.findById(id);
    const result = await this.vehicleRepository.update(id, data);
    affectedOrFail(result, "Vehículo");
  }

  async delete(id) {
    await this.findById(id);
    const result = await this.vehicleRepository.delete(id);
    affectedOrFail(result, "Vehículo");
  }
}

module.exports = { VehicleService };
