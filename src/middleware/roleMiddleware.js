const ApiError = require("../utils/ApiError");

const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, "You do not have permission for this action");
  }

  next();
};

module.exports = authorizeRoles;
