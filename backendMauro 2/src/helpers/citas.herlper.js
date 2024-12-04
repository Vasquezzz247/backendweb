const Citas = require("../models/citas.model");

const createAppointment = async (appointmentData) => {
  try {
    const newAppointment = new Citas(appointmentData);
    const savedAppointment = await newAppointment.save();
    return savedAppointment;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error("No se pudo crear la cita.");
  }
};

const findAppointments = async (filter = {}) => {
  try {
    const appointments = await Citas.find(filter);
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("No se pudieron obtener las citas.");
  }
};

const findAppointmentById = async (id) => {
  try {
    const appointment = await Citas.findById(id);
    if (!appointment) {
      throw new Error(`Cita con ID ${id} no encontrada.`);
    }
    return appointment;
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    throw new Error("No se pudo obtener la cita solicitada.");
  }
};

const updateAppointmentById = async (id, updates) => {
  try {
    const updatedAppointment = await Citas.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedAppointment) {
      throw new Error(`Cita con ID ${id} no encontrada para actualizar.`);
    }
    return updatedAppointment;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw new Error("No se pudo actualizar la cita.");
  }
};

module.exports = {
  findAppointments,
  findAppointmentById,
  createAppointment,
  updateAppointmentById,
};
