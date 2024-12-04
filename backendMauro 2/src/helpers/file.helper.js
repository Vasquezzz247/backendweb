const mongoose = require("mongoose");
const File = require("../models/file.model");
const User = require("../models/user.model");

const saveFileToDatabase = async (fileName, relativePath, userId) => {
  try {
    const newFile = new File({
      name: fileName,
      path: relativePath,
      uploadedBy: userId,
    });

    await newFile.save();
    return newFile;
  } catch (error) {
    throw new Error("Error guardando el archivo en la base de datos: " + error.message);
  }
};

const findFileById = async (fileId) => {
  try {
    return await File.findById(fileId);
  } catch (error) {
    throw new Error("Error obteniendo archivo: " + error.message);
  }
};

const findFilesByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }
    return await File.find({ uploadedBy: user._id });
  } catch (error) {
    throw new Error("Error obteniendo archivos por correo electrónico: " + error.message);
  }
};

module.exports = {
  saveFileToDatabase,
  findFileById,
  findFilesByEmail,
};
