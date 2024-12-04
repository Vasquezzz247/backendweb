const express = require("express");
const { auth, requireRole } = require("../middlewares/auth.middleware");
const {
  createDoctorRequest,
  listDoctorRequests,
  listDoctorRequestsByStatus,
  updateDoctorRequestStatus,
  deleteDoctorRequest,
} = require("../controllers/solicitudes.controller");

const router = express.Router();

router.post("/", auth, requireRole("doctor"), createDoctorRequest);
router.get("/all", auth, requireRole("admin"), listDoctorRequests);
router.get("/", auth, requireRole("admin"), listDoctorRequestsByStatus);
router.patch(
  "/:requestId",
  auth,
  requireRole("admin"),
  updateDoctorRequestStatus
);
router.delete("/:requestId", auth, requireRole("admin"), deleteDoctorRequest);

module.exports = router;
