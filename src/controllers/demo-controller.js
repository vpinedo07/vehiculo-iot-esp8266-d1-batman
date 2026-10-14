class DemoController {
  constructor(demoService) {
    this.demoService = demoService;
  }

  async create(request, response) {
    const demo = await this.demoService.create(
      request.validated.params.vehicleId,
      request.validated.body,
    );
    response.status(201).json({ data: demo });
  }

  async findByVehicle(request, response) {
    const demos = await this.demoService.findByVehicle(
      request.validated.params.vehicleId,
    );
    response.json({ data: demos });
  }

  async update(request, response) {
    await this.demoService.update(
      request.validated.params.id,
      request.validated.body,
    );
    response.json({ message: "Demo actualizada correctamente" });
  }

  async delete(request, response) {
    await this.demoService.delete(request.validated.params.id);
    response.status(204).send();
  }

  async addMovement(request, response) {
    await this.demoService.addMovement(
      request.validated.params.demoId,
      request.validated.body,
    );
    response.status(201).json({ message: "Movimiento agregado correctamente" });
  }

  async findMovements(request, response) {
    const movements = await this.demoService.findMovements(
      request.validated.params.demoId,
    );
    response.json({ data: movements });
  }

  async updateMovement(request, response) {
    await this.demoService.updateMovement(
      request.validated.params.id,
      request.validated.body,
    );
    response.json({ message: "Movimiento actualizado correctamente" });
  }

  async deleteMovement(request, response) {
    await this.demoService.deleteMovement(request.validated.params.id);
    response.status(204).send();
  }
}

module.exports = { DemoController };
