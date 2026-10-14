const { ensureVehicleExists } = require("./service-helpers");

class HistoryService {
  constructor(historyRepository, vehicleRepository) {
    this.historyRepository = historyRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async create(vehicleId, data) {
    await ensureVehicleExists(this.vehicleRepository, vehicleId);
    await this.historyRepository.create(vehicleId, data);
  }

  async findByVehicle(vehicleId) {
    await ensureVehicleExists(this.vehicleRepository, vehicleId);
    const result = await this.historyRepository.findByVehicle(vehicleId);
    return result.rows;
  }
}

module.exports = { HistoryService };
