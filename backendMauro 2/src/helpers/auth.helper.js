const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const extractUserIdFromToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido." });
  }
};
const generateAuthToken = async (user) => {
  const token = jwt.sign(
    {
      _id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};
const findUserByCredentials = async (email, password, healthPersonnelCode) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login. Check your credentials.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login. Check your credentials.");
  }

  if (healthPersonnelCode && user.healthPersonnelCode !== healthPersonnelCode) {
    throw new Error("Health personnel code does not match.");
  }

  return user;
};
//:p
module.exports = {
  generateAuthToken,
  findUserByCredentials,
  extractUserIdFromToken,
};

