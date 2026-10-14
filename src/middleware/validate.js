const { AppError } = require("../errors/app-error");

function validate(schemas) {
  return (request, response, next) => {
    void response;
    const validated = {};

    for (const [location, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(request[location]);

      if (!result.success) {
        return next(
          new AppError(
            "La solicitud contiene datos inválidos",
            422,
            "VALIDATION_ERROR",
            result.error.issues.map((issue) => ({
              field: [location, ...issue.path].join("."),
              message: issue.message,
            })),
          ),
        );
      }

      validated[location] = result.data;
    }

    request.validated = validated;
    return next();
  };
}

module.exports = { validate };
