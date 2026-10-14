const { Router } = require("express");
const schemas = require("../validators/schemas");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../middleware/async-handler");

function createDemoRouter(controller) {
  const router = Router();
  const handle = (method) => asyncHandler(controller[method].bind(controller));

  router
    .route("/vehiculos/:vehicleId/demos")
    .post(
      validate({
        params: schemas.vehicleIdParams,
        body: schemas.createDemo,
      }),
      handle("create"),
    )
    .get(
      validate({ params: schemas.vehicleIdParams }),
      handle("findByVehicle"),
    );

  router
    .route("/demos/:id")
    .put(
      validate({ params: schemas.idParams, body: schemas.updateDemo }),
      handle("update"),
    )
    .delete(validate({ params: schemas.idParams }), handle("delete"));

  router
    .route("/demos/:demoId/movimientos")
    .post(
      validate({
        params: schemas.demoIdParams,
        body: schemas.createMovement,
      }),
      handle("addMovement"),
    )
    .get(validate({ params: schemas.demoIdParams }), handle("findMovements"));

  router
    .route("/demo-movimientos/:id")
    .put(
      validate({ params: schemas.idParams, body: schemas.updateMovement }),
      handle("updateMovement"),
    )
    .delete(validate({ params: schemas.idParams }), handle("deleteMovement"));

  return router;
}

module.exports = { createDemoRouter };
