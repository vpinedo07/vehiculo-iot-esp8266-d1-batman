const { AppError } = require("../errors/app-error");

function notFoundHandler(request, response) {
  response.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `No existe la ruta ${request.method} ${request.originalUrl}`,
    },
  });
}

function mysqlErrorToAppError(error) {
  if (error.code === "ER_DUP_ENTRY") {
    return new AppError(
      "El registro ya existe o viola una restricción única",
      409,
      "DUPLICATE_RESOURCE",
    );
  }

  if (
    ["ER_NO_REFERENCED_ROW_2", "ER_ROW_IS_REFERENCED_2"].includes(error.code)
  ) {
    return new AppError(
      "La operación viola una relación entre registros",
      409,
      "RELATION_CONFLICT",
    );
  }

  if (
    ["ECONNREFUSED", "ETIMEDOUT", "PROTOCOL_CONNECTION_LOST"].includes(
      error.code,
    )
  ) {
    return new AppError(
      "La base de datos no está disponible",
      503,
      "DATABASE_UNAVAILABLE",
    );
  }

  return null;
}

function errorHandler(error, request, response, next) {
  void request;
  void next;
  const normalizedError =
    error instanceof AppError ? error : (mysqlErrorToAppError(error) ?? error);
  const statusCode = normalizedError.statusCode ?? 500;

  if (statusCode >= 500) console.error(normalizedError);

  response.status(statusCode).json({
    error: {
      code: normalizedError.code ?? "INTERNAL_ERROR",
      message:
        statusCode >= 500
          ? "Ocurrió un error interno"
          : normalizedError.message,
      ...(normalizedError.details ? { details: normalizedError.details } : {}),
    },
  });
}

module.exports = { errorHandler, notFoundHandler };
