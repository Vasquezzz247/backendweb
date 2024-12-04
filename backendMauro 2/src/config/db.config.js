const mongoose = require("mongoose");
const debug = require("debug")("app:db");
const envconfig = require("./env.config");

const uri = envconfig.MONGO_URI;

const connect = async () => {
  try {
    await mongoose.connect(uri);
    debug("Conexión exitosa a la base de datos!");
  } catch (error) {
    debug(`[Error]: Can't connect to database - ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connect };
