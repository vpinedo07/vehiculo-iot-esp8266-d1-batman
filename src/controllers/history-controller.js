class HistoryController {
  constructor(historyService) {
    this.historyService = historyService;
  }

  async create(request, response) {
    await this.historyService.create(
      request.validated.params.vehicleId,
      request.validated.body,
    );
    response
      .status(201)
      .json({ message: "Historial registrado correctamente" });
  }

  async findByVehicle(request, response) {
    const history = await this.historyService.findByVehicle(
      request.validated.params.vehicleId,
    );
    response.json({ data: history });
  }
}

module.exports = { HistoryController };
