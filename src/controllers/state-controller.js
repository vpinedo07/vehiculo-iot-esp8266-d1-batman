class StateController {
  constructor(stateService) {
    this.stateService = stateService;
  }

  async update(request, response) {
    await this.stateService.update(
      request.validated.params.vehicleId,
      request.validated.body,
    );
    response.json({ message: "Estado actualizado correctamente" });
  }

  async findByVehicle(request, response) {
    const state = await this.stateService.findByVehicle(
      request.validated.params.vehicleId,
    );
    response.json({ data: state });
  }
}

module.exports = { StateController };
