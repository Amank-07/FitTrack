const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const ApiError = require("../utils/ApiError");

const sanitizeUser = (user) => {
  const plain = user.toObject();
  delete plain.password;
  return plain;
};

const createUser = async ({ name, email, password, role, status }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "viewer",
    status: status || "active"
  });

  return sanitizeUser(user);
};

const listUsers = async () => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return users;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const updateUser = async (userId, updates) => {
  const allowedFields = ["name", "role", "status"];
  const payload = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      payload[field] = updates[field];
    }
  }

  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
};

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser
};
