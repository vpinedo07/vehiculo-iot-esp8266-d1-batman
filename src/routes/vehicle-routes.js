const { Router } = require("express");
const schemas = require("../validators/schemas");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/async-handler");

function createVehicleRouter(controller) {
  const router = Router();
  const handle = (method) => asyncHandler(controller[method].bind(controller));

  router
    .route("/vehiculos")
    .post(validate({ body: schemas.createVehicle }), handle("create"))
    .get(handle("findAll"));

  router
    .route("/vehiculos/:id")
    .get(validate({ params: schemas.idParams }), handle("findById"))
    .put(
      validate({ params: schemas.idParams, body: schemas.updateVehicle }),
      handle("update"),
    )
    .delete(validate({ params: schemas.idParams }), handle("delete"));

  return router;
}

module.exports = { createVehicleRouter };
