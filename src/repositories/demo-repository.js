const { BaseRepository } = require("./base-repository");

class DemoRepository extends BaseRepository {
  create(vehicleId, { nombre, descripcion }) {
    return this.call("sp_crear_demo", [vehicleId, nombre, descripcion ?? null]);
  }

  findByVehicle(vehicleId) {
    return this.call("sp_obtener_demos", [vehicleId]);
  }

  update(id, data) {
    return this.call("sp_actualizar_demo", [
      id,
      data.nombre,
      data.descripcion ?? null,
      data.activo,
    ]);
  }

  delete(id) {
    return this.call("sp_eliminar_demo", [id]);
  }

  addMovement(demoId, movement) {
    return this.call("sp_agregar_movimiento_demo", [
      demoId,
      movement.id_comando,
      movement.orden,
      movement.duracion_ms,
      movement.pausa_ms,
    ]);
  }

  findMovements(demoId) {
    return this.call("sp_obtener_movimientos_demo", [demoId]);
  }

  updateMovement(id, movement) {
    return this.call("sp_actualizar_movimiento_demo", [
      id,
      movement.id_comando,
      movement.orden,
      movement.duracion_ms,
      movement.pausa_ms,
    ]);
  }

  deleteMovement(id) {
    return this.call("sp_eliminar_movimiento_demo", [id]);
  }
}

module.exports = { DemoRepository };
