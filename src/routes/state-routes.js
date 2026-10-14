const { Router } = require("express");
const schemas = require("../validators/schemas");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/async-handler");

function createStateRouter(controller) {
  const router = Router();
  const handle = (method) => asyncHandler(controller[method].bind(controller));

  router
    .route("/vehiculos/:vehicleId/estado")
    .get(validate({ params: schemas.vehicleIdParams }), handle("findByVehicle"))
    .put(
      validate({
        params: schemas.vehicleIdParams,
        body: schemas.updateState,
      }),
      handle("update"),
    );

  return router;
}

module.exports = { createStateRouter };
