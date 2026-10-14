const { BaseRepository } = require("./base-repository");

class VehicleRepository extends BaseRepository {
  create({ nombre, modelo, descripcion, microcontrolador }) {
    return this.call("sp_crear_vehiculo", [
      nombre,
      modelo ?? null,
      descripcion ?? null,
      microcontrolador ?? null,
    ]);
  }

  findAll() {
    return this.call("sp_obtener_vehiculos");
  }

  findById(id) {
    return this.call("sp_obtener_vehiculo", [id]);
  }

  update(id, data) {
    return this.call("sp_actualizar_vehiculo", [
      id,
      data.nombre,
      data.modelo ?? null,
      data.descripcion ?? null,
      data.microcontrolador ?? null,
      data.activo,
    ]);
  }

  delete(id) {
    return this.call("sp_eliminar_vehiculo", [id]);
  }
}

module.exports = { VehicleRepository };
