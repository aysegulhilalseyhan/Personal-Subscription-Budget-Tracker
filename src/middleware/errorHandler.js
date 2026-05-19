function notFound(_req, _res, next) {
  const error = new Error('Route was not found.');
  error.status = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;

  res.status(status).json({
    message: error.message || 'Unexpected server error.',
    details: error.details || undefined
  });
}

module.exports = {
  notFound,
  errorHandler
};
