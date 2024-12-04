//ya
const User = require("../models/user.model");
const {
  generateAuthToken,
  findByCredentials,
  verifyGoogleToken,
  findOrCreateGoogleUser,
} = require("../services/auth.service");
const { saveUser, findUserById } = require("../helpers/user.helper");

const signUp = async (req, res) => {
  const { password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) throw new Error("Passwords do not match");

    const user = new User(req.body);
    await saveUser(user);

    const token = await generateAuthToken(user);

    res.status(201).send({ message: "Successful sign up" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password, healthPersonnelCode } = req.body;

  try {
    const user = await findByCredentials(email, password, healthPersonnelCode);
    const token = await generateAuthToken(user);

    res.send({
      token,
      role: user.role,
      user,
      message: "Exito al iniciar sesion",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const googleLogin = async (req, res) => {
  const { token: googleToken } = req.body;
  console.log(googleToken);
  try {
    if (!googleToken) throw new Error("Google token is required");

    const payload = await verifyGoogleToken(googleToken);
    const user = await findOrCreateGoogleUser(payload);
    const token = await generateAuthToken(user);

    res.send({
      token,
      role: user.role,
      user,
      message: "Google login successful",
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const checkAuth = async (req, res) => {
  const { user, token } = req;

  try {
    res.send({ message: "User is authenticated", user, token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    if (!["admin", "doctor", "patient"].includes(role)) {
      throw new Error("Invalid role specified");
    }

    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.role = role;

    await user.save();

    res.send({ user, message: "Role updated successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await saveUser(req.user);

    res.send({ message: "Successful logout" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await saveUser(req.user);

    res.send({ message: "Successfully logged out from all sessions" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  signUp,
  login,
  googleLogin,
  checkAuth,
  updateRole,
  logout,
  logoutAll,
};
