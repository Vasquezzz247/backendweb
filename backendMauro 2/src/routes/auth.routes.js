const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const {
  signUp,
  login,
  googleLogin,
  checkAuth,
  logout,
  logoutAll,
  updateRole,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/sign_up", signUp);
router.post("/login", login);
router.post("/google_login", googleLogin); // Ruta para Google Login
router.get("/check", auth, checkAuth);
router.post("/logout", auth, logout);
router.post("/logoutall", auth, logoutAll);
router.patch("/update_role", auth, updateRole);

module.exports = router;