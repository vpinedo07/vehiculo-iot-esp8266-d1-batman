class VehicleController {
  constructor(vehicleService) {
    this.vehicleService = vehicleService;
  }

  async create(request, response) {
    const vehicle = await this.vehicleService.create(request.validated.body);
    response.status(201).json({ data: vehicle });
  }

  async findAll(request, response) {
    void request;
    const vehicles = await this.vehicleService.findAll();
    response.json({ data: vehicles });
  }

  async findById(request, response) {
    const vehicle = await this.vehicleService.findById(
      request.validated.params.id,
    );
    response.json({ data: vehicle });
  }

  async update(request, response) {
    await this.vehicleService.update(
      request.validated.params.id,
      request.validated.body,
    );
    response.json({ message: "Vehículo actualizado correctamente" });
  }

  async delete(request, response) {
    await this.vehicleService.delete(request.validated.params.id);
    response.status(204).send();
  }
}

module.exports = { VehicleController };
