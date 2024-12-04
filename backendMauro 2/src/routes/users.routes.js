const express = require("express");
const { getUserByEmail, updateUserRole } = require("../controllers/users.controller");
const router = express.Router();

router.get("/users", getUserByEmail);
router.patch("/users/:userId", updateUserRole);

module.exports = router;
