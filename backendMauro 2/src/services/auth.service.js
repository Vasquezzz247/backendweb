const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAuthToken = async (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  if (user.tokens.length >= 5) user.tokens.shift();
  user.tokens.push({ token });

  try {
    await user.save();
  } catch (error) {
    throw new Error("Error saving user tokens");
  }

  return token;
};

const findByCredentials = async (
  email,
  password,
  healthPersonnelCode = null
) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  if (user.isHealthPersonnel) {
    if (!healthPersonnelCode)
      throw new Error("Health personnel code is required");
    if (healthPersonnelCode !== user.healthPersonnelCode)
      throw new Error("Invalid health personnel code");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return user;
};

// Validar token de Google y encontrar/crear usuario
const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return payload;
};

const findOrCreateGoogleUser = async (payload) => {
  const { email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      name,
      email,
      picture,
      google: true,
    });

    await user.save();
  }

  return user;
};

module.exports = {
  generateAuthToken,
  findByCredentials,
  verifyGoogleToken,
  findOrCreateGoogleUser,
};
