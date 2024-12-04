const User = require("../models/user.model");

const saveUser = async (user) => {
  try {
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Failed to save user: " + error.message);
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Failed to find user: " + error.message);
  }
};

module.exports = {
  saveUser,
  findUserById,
};
