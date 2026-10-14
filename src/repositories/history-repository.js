const { BaseRepository } = require("./base-repository");

class HistoryRepository extends BaseRepository {
  create(vehicleId, { id_comando, origen }) {
    return this.call("sp_registrar_historial", [vehicleId, id_comando, origen]);
  }

  findByVehicle(vehicleId) {
    return this.call("sp_obtener_historial", [vehicleId]);
  }
}

module.exports = { HistoryRepository };
