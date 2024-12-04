const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const {
  createAppointmentController,
  listAvailableAppointments,
  bookAppointment,
  cancelAppointment,
  listAppointmentsByDoctor,
  listAppointmentsByPatient,
  listAllAppointments,
} = require("../controllers/citas.controller");

const router = express.Router();

router.post("/create", auth, createAppointmentController);
router.get("/available", listAvailableAppointments);
router.post("/book/:appointmentId", auth, bookAppointment);
router.post("/cancel/:appointmentId", auth, cancelAppointment);
router.get("/doctor/:doctorId", auth, listAppointmentsByDoctor);
router.get("/patient/:patientId", auth, listAppointmentsByPatient);
router.get("/all", auth, listAllAppointments);


module.exports = router;
