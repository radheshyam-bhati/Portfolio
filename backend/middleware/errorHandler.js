export function notFoundHandler(request, response) {
  response.status(404).json({
    ok: false,
    message: `No route exists for ${request.method} ${request.originalUrl}.`,
  });
}

export function errorHandler(error, _request, response, next) {
  void next;
  const statusCode = Number(error.statusCode || 500);
  const message =
    statusCode >= 500
      ? error.message || 'An unexpected server error occurred.'
      : error.message;

  response.status(statusCode).json({
    ok: false,
    message,
    errors: error.details || null,
  });
}
