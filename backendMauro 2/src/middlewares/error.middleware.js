const debug = require("debug")("DOCLET:error");

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production" ? "Algo salió mal" : err.message;

  debug(err);
  res.status(status).json({ message });
};

module.exports = { errorHandler };
