const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const { auth } = require("../middlewares/auth.middleware");
const {
  uploadFile,
  getFilesByUser,
  getFileById,
  getFilesByUserId,
  getFilesByEmail,
} = require("../controllers/file.controller");

// Rutas específicas deben ir antes de rutas dinámicas para evitar conflictos
router.get("/search", auth, getFilesByEmail); // Ruta para buscar archivos por correo electrónico
router.get("/:fileId", auth, getFileById); // Ruta para obtener archivo por ID
router.get("/user/:userId", auth, getFilesByUserId); // Ruta para obtener imágenes de un usuario por ID
router.post("/upload", auth, upload, uploadFile);
router.get("/", auth, getFilesByUser);

module.exports = router;
