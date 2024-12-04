const {
  findAppointments,
  findAppointmentById,
  createAppointment,
  updateAppointmentById,
} = require("../helpers/citas.herlper");

const createAppointmentController = async (req, res) => {
  const { title, start, end, description } = req.body;

  try {
    const user = req.user;

    if (user.role !== "doctor") {
      return res
        .status(403)
        .send({ error: "Only doctors can create appointments" });
    }

    const newAppointmentData = {
      doctorId: user._id,
      doctorName: user.name,
      title,
      start,
      end,
      description,
      status: "available",
    };

    const newAppointment = await createAppointment(newAppointmentData);

    res.status(201).send({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const listAvailableAppointments = async (req, res) => {
  try {
    const appointments = await findAppointments({ status: "available" });

    res.send({
      message: "Available appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Nuevo controlador para listar todas las citas
const listAllAppointments = async (req, res) => {
  try {
    const appointments = await findAppointments(); // Sin filtros, se obtienen todas las citas.

    res.send({
      message: "All appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const bookAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const user = req.user;

    if (user.role !== "patient") {
      return res
        .status(403)
        .send({ error: "Only patients can book appointments" });
    }

    const appointment = await findAppointmentById(appointmentId);

    if (!appointment) {
      return res.status(404).send({ error: "Appointment not found" });
    }

    if (appointment.status !== "available") {
      return res.status(400).send({ error: "Appointment is not available" });
    }

    const updatedAppointment = await updateAppointmentById(appointmentId, {
      patientId: user._id,
      patientName: user.name,
      status: "booked",
    });

    res.send({
      message: "Appointment booked successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const user = req.user;

    const appointment = await findAppointmentById(appointmentId);

    if (!appointment) {
      return res.status(404).send({ error: "Appointment not found" });
    }

    if (
      appointment.doctorId.toString() !== user._id.toString() &&
      appointment.patientId?.toString() !== user._id.toString()
    ) {
      return res.status(403).send({
        error: "You do not have permission to cancel this appointment",
      });
    }

    const updatedAppointment = await updateAppointmentById(appointmentId, {
      status: "cancelled",
    });

    res.send({
      message: "Appointment cancelled successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const listAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const appointments = await findAppointments({ doctorId });

    res.send({
      message: "Appointments retrieved for doctor",
      appointments,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const listAppointmentsByPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    const appointments = await findAppointments({ patientId });

    res.send({
      message: "Appointments retrieved for patient",
      appointments,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createAppointmentController,
  listAvailableAppointments,
  listAllAppointments, // Exportamos el nuevo controlador
  bookAppointment,
  cancelAppointment,
  listAppointmentsByDoctor,
  listAppointmentsByPatient,
};
