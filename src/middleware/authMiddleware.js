const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Authentication token is required");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(payload.userId).select("-password");
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "User account is inactive");
  }

  req.user = user;
  next();
});

module.exports = authMiddleware;
