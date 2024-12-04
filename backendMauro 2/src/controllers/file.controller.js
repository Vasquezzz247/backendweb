const User = require("../models/user.model");
const path = require("path");
const File = require("../models/file.model");
const {
  saveFileToDatabase,
  findFileById,
  findFilesByEmail
} = require("../helpers/file.helper");

// Subir archivo
const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se ha enviado un archivo." });
  }

  try {
    const relativePath = `/uploads/${req.file.filename}`;
    const file = await saveFileToDatabase(req.file.originalname, relativePath, req.user._id);

    return res.status(200).json({
      message: "Archivo subido exitosamente",
      file: {
        id: file._id,
        name: file.name,
        path: file.path,
        uploadedBy: file.uploadedBy,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al guardar el archivo." });
  }
};

// Obtener archivos del usuario autenticado
const getFilesByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const files = await File.find({ uploadedBy: userId });

    if (!files.length) {
      return res.status(404).json({ error: "No se encontraron archivos para este usuario." });
    }

    res.json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos del usuario." });
  }
};

// Obtener archivos de un usuario específico (por ID)
const getFilesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = await File.find({ uploadedBy: userId });

    if (!files.length) {
      return res.status(404).json({ error: "No se encontraron archivos para este usuario." });
    }

    res.json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos del usuario." });
  }
};

// Obtener archivo por ID
const getFileById = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await findFileById(fileId);

    if (!file) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    res.json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el archivo." });
  }
};

const getFilesByEmail = async (req, res) => {
  try {
    const { email } = req.query; // Leer el correo electrónico desde los parámetros de consulta
    if (!email) {
      return res.status(400).json({ error: "El correo electrónico es obligatorio." });
    }

    const files = await findFilesByEmail(email);

    if (!files.length) {
      return res.status(404).json({ error: "No se encontraron archivos para este usuario." });
    }

    res.json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los archivos por correo electrónico." });
  }
};


module.exports = {
  uploadFile,
  getFilesByUser,
  getFileById,
  getFilesByUserId,
  getFilesByEmail,
};
