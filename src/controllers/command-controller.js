class CommandController {
  constructor(commandService) {
    this.commandService = commandService;
  }

  async create(request, response) {
    const command = await this.commandService.create(
      request.validated.params.vehicleId,
      request.validated.body,
    );
    response.status(201).json({ data: command });
  }

  async findByVehicle(request, response) {
    const commands = await this.commandService.findByVehicle(
      request.validated.params.vehicleId,
    );
    response.json({ data: commands });
  }

  async update(request, response) {
    await this.commandService.update(
      request.validated.params.id,
      request.validated.body,
    );
    response.json({ message: "Comando actualizado correctamente" });
  }

  async delete(request, response) {
    await this.commandService.delete(request.validated.params.id);
    response.status(204).send();
  }
}

module.exports = { CommandController };
