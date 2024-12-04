const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid email address");
    },
  },
  password: {
    type: String,
    minlength: [8, "Password must be at least 8 characters long"],
    trim: true,
    validate(value) {
      if (
        value &&
        !value.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      ) {
        throw new Error(
          "Password must include uppercase, lowercase, number, and special character"
        );
      }
    },
  },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    default: "patient",
  },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
  picture: { type: String }, // Imagen del perfil del usuario
  google: { type: Boolean, default: false }, // Indica si el usuario inició sesión con Google
});

// Hash de la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password") && !user.google) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Modificar la salida JSON para ocultar campos sensibles
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
