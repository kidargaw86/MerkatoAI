export function errorHandler(err, _req, res, _next) {
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error"
  });
}
