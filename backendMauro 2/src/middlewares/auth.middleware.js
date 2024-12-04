const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

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

const auth = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const authorization = req.header("Authorization");
    if (!authorization) {
      throw new Error("Authorization header is missing");
    }

    const token = authorization.replace("Bearer ", "");

    console.log(token);
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decode._id, "tokens.token": token });
    if (!user) {
      throw new Error("User not found or invalid token");
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication failed" });
  }
};

const requireRole = (role) => (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    if (req.user.role !== role) {
      return res
        .status(403)
        .send({ error: "Access denied: insufficient permissions" });
    }

    next();
  } catch (error) {
    res.status(403).send({ error: error.message });
  }
};

module.exports = {
  auth,
  requireRole,
  extractUserIdFromToken,
};
