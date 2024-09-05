const mongoose = require("mongoose");
const schema = require("./schema");
const bcrypt = require("bcryptjs");

const users = mongoose.model("users", schema.userSchema);

async function getAllUsers() {
  return users.find();
}

async function getUserById(id) {
  return await users.findById(id);
}

async function createUser(user) {
  user.password = await bcrypt.hash(user.password, 10);
  return users.create(user);
}

async function updateUser(id, user) {
  return users.findByIdAndUpdate(id, user, { new: true });
}

async function deleteUser(id) {
  return users.findByIdAndDelete(id);
}

async function searchUserByName(name) {
  return await users.find({ name: name });
}

async function searcByUsername(username) {
  return await users.find({ username: username });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUserByName,
  searcByUsername,
};
