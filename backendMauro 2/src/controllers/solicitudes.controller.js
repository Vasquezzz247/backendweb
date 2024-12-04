const DoctorRequest = require("../models/solicitudes.model");

const createDoctorRequest = async (req, res) => {
  const { description } = req.body;

  try {
    const newRequest = new DoctorRequest({
      doctorId: req.user._id,
      description,
    });

    await newRequest.save();

    res
      .status(201)
      .send({ message: "Request created successfully", request: newRequest });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateDoctorRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ error: "Invalid status" });
    }

    const updatedRequest = await DoctorRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).send({ error: "Request not found" });
    }

    res.send({
      message: "Request status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteDoctorRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const deletedRequest = await DoctorRequest.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).send({ error: "Request not found" });
    }

    res.send({
      message: "Request deleted successfully",
      request: deletedRequest,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const listDoctorRequests = async (req, res) => {
  try {
    const requests = await DoctorRequest.find()
      .populate("doctorId", "name email")
      .exec();

    res.send({ message: "Requests retrieved successfully", requests });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const listDoctorRequestsByStatus = async (req, res) => {
  const { status } = req.query;

  try {
    const validStatuses = ["pending", "approved", "rejected"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).send({ error: "Invalid status" });
    }

    const filter = status ? { status } : {};
    const requests = await DoctorRequest.find(filter)
      .populate("doctorId", "name email")
      .exec();

    res.send({ message: "Requests retrieved successfully", requests });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createDoctorRequest,
  listDoctorRequests,
  updateDoctorRequestStatus,
  deleteDoctorRequest,
  listDoctorRequestsByStatus,
};
