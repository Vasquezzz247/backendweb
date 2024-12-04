const express = require("express");
const authRoutes = require("./auth.routes");
const appointmentRoutes = require("./citas.routes");
const adminRoutes = require("./admin.routes");
const solicitudesRoutes = require("./solicitudes.routes");
const fileRoutes = require("./files.routes");
const userRoutes = require("./users.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/citas", appointmentRoutes);
router.use("/admin", adminRoutes);
router.use("/solicitudes", solicitudesRoutes);
router.use("/files", fileRoutes);
router.use("/users", userRoutes);

router.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = router;
