const { Router } = require("express");
const schemas = require("../validators/schemas");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/async-handler");

function createHistoryRouter(controller) {
  const router = Router();
  const handle = (method) => asyncHandler(controller[method].bind(controller));

  router
    .route("/vehiculos/:vehicleId/historial")
    .post(
      validate({
        params: schemas.vehicleIdParams,
        body: schemas.createHistory,
      }),
      handle("create"),
    )
    .get(
      validate({ params: schemas.vehicleIdParams }),
      handle("findByVehicle"),
    );

  return router;
}

module.exports = { createHistoryRouter };
