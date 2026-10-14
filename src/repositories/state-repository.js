const { BaseRepository } = require("./base-repository");

class StateRepository extends BaseRepository {
  update(vehicleId, { id_comando, conectado }) {
    return this.call("sp_actualizar_estado", [
      vehicleId,
      id_comando,
      conectado,
    ]);
  }

  findByVehicle(vehicleId) {
    return this.call("sp_obtener_estado", [vehicleId]);
  }
}

module.exports = { StateRepository };
