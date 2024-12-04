const express = require("express");
const { auth, requireRole } = require("../middlewares/auth.middleware");
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/admin.controller");

const router = express.Router();

router.post("/doctors", auth, requireRole("admin"), createDoctor);
router.get("/doctors", auth, requireRole("admin"), getDoctors);
router.get("/doctors/:doctorId", auth, requireRole("admin"), getDoctorById);
router.patch("/doctors/:doctorId", auth, requireRole("admin"), updateDoctor);
router.delete("/doctors/:doctorId", auth, requireRole("admin"), deleteDoctor);

module.exports = router;
