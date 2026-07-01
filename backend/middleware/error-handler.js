function errorHandler(error, req, res, next) {
  const status = error.statusCode || error.status || 500

  if (status >= 500) {
    console.error(error)
  }

  return res.status(status).json({
    error: error.message || "Internal server error",
  })
}

module.exports = errorHandler
