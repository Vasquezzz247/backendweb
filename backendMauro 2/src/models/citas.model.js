const mongoose = require("mongoose");

const citasSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  doctorName: {
    type: String,
    required: true,
    trim: true,
  },
  patientName: {
    type: String,
    default: null,
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > new Date();
      },
      message:
        "La hora y fecha de inicio tiene que ser una hora y fecha futura.",
    },
  },
  end: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value >= this.start;
      },
      message:
        "La hora y fecha de fin tiene que ser despues de la hora y fecha de inicio.",
    },
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  status: {
    type: String,
    enum: ["available", "booked", "cancelled"],
    default: "available",
  },
});

module.exports = mongoose.model("Citas", citasSchema);
