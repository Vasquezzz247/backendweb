const mongoose = require("mongoose");
const User = require("../models/user.model");

const createDoctor = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newDoctor = new User({
      name,
      email,
      password,
      role: "doctor",
    });

    await newDoctor.save();

    res.status(201).send({
      message: "Doctor created successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });

    res.send({
      message: "Doctors retrieved successfully",
      doctors,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getDoctorById = async (req, res) => {
  const { doctorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).send({ error: "Invalid doctor ID" });
  }

  try {
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });

    if (!doctor) {
      return res.status(404).send({ error: "Doctor not found" });
    }

    res.send({
      message: "Doctor retrieved successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateDoctor = async (req, res) => {
  const { doctorId } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).send({ error: "Invalid doctor ID" });
  }

  try {
    const doctor = await User.findOneAndUpdate(
      { _id: doctorId, role: "doctor" },
      { $set: updates },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).send({ error: "Doctor not found" });
    }

    res.send({
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  const { doctorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).send({ error: "Invalid doctor ID" });
  }

  try {
    const doctor = await User.findOneAndDelete({
      _id: doctorId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).send({ error: "Doctor not found" });
    }

    res.send({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
