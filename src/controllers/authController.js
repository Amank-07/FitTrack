const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data
  });
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data
  });
});

module.exports = {
  register,
  login
};
