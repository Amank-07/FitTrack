const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const ApiError = require("../utils/ApiError");

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });

const sanitizeUser = (user) => {
  const plain = user.toObject();
  delete plain.password;
  return plain;
};

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = signToken(user._id);
  return { token, user: sanitizeUser(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "User account is inactive");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user._id);
  return { token, user: sanitizeUser(user) };
};

module.exports = {
  register,
  login
};
