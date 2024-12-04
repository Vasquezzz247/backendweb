require("dotenv").config();

process.env.DEBUG = "app:*";

const express = require("express");
const debug = require("debug")("app:server");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const envconfig = require("./src/config/env.config");
const db = require("./src/config/db.config");
const routes = require("./src/routes/main.routes");
const { errorHandler } = require("./src/middlewares/error.middleware");

// Verificación del entorno para Google
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Falta configurar GOOGLE_CLIENT_ID en el archivo .env");
}

const app = express();

const uploadsDir = path.join(__dirname, "src/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

db.connect();

app.use(express.json());
app.use(cors({ origin: "https://6750131a42edd01831b032b5--beamish-yeot-cf07b9.netlify.app" }));

app.use("/uploads", express.static(uploadsDir));
app.use("/api", routes);

app.use(errorHandler);

const PORT = envconfig.PORT || 3000;
app.listen(PORT, () => {
  debug(`Servidor corriendo en https://6750131a42edd01831b032b5--beamish-yeot-cf07b9.netlify.app:${PORT}`);
});
