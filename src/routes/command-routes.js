const { Router } = require("express");
const schemas = require("../validators/schemas");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/async-handler");

function createCommandRouter(controller) {
  const router = Router();
  const handle = (method) => asyncHandler(controller[method].bind(controller));

  router
    .route("/vehiculos/:vehicleId/comandos")
    .post(
      validate({
        params: schemas.vehicleIdParams,
        body: schemas.createCommand,
      }),
      handle("create"),
    )
    .get(
      validate({ params: schemas.vehicleIdParams }),
      handle("findByVehicle"),
    );

  router
    .route("/comandos/:id")
    .put(
      validate({ params: schemas.idParams, body: schemas.updateCommand }),
      handle("update"),
    )
    .delete(validate({ params: schemas.idParams }), handle("delete"));

  return router;
}

module.exports = { createCommandRouter };
