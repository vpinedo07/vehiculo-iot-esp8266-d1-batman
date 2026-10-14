const { BaseRepository } = require("./base-repository");

class CommandRepository extends BaseRepository {
  create(vehicleId, { nombre, codigo, descripcion }) {
    return this.call("sp_crear_comando", [
      vehicleId,
      nombre,
      codigo,
      descripcion ?? null,
    ]);
  }

  findByVehicle(vehicleId) {
    return this.call("sp_obtener_comandos_vehiculo", [vehicleId]);
  }

  update(id, data) {
    return this.call("sp_actualizar_comando", [
      id,
      data.nombre,
      data.codigo,
      data.descripcion ?? null,
      data.activo,
    ]);
  }

  delete(id) {
    return this.call("sp_eliminar_comando", [id]);
  }
}

module.exports = { CommandRepository };
