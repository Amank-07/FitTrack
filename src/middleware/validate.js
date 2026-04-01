const ApiError = require("../utils/ApiError");

const validateEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validate = (schemaFactory) => (req, _res, next) => {
  const errors = schemaFactory(req);

  if (errors.length > 0) {
    throw new ApiError(400, errors[0]);
  }

  next();
};

const authValidators = {
  register: validate((req) => {
    const { name, email, password } = req.body;
    const errors = [];

    if (!name || typeof name !== "string") errors.push("Name is required");
    if (!validateEmail(email)) errors.push("Valid email is required");
    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    return errors;
  }),
  login: validate((req) => {
    const { email, password } = req.body;
    const errors = [];

    if (!validateEmail(email)) errors.push("Valid email is required");
    if (!password) errors.push("Password is required");

    return errors;
  })
};

const userValidators = {
  create: validate((req) => {
    const { name, email, password, role, status } = req.body;
    const errors = [];

    if (!name || typeof name !== "string") errors.push("Name is required");
    if (!validateEmail(email)) errors.push("Valid email is required");
    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    if (role && !["viewer", "analyst", "admin"].includes(role)) {
      errors.push("Role must be viewer, analyst, or admin");
    }
    if (status && !["active", "inactive"].includes(status)) {
      errors.push("Status must be active or inactive");
    }

    return errors;
  }),
  update: validate((req) => {
    const { role, status, name } = req.body;
    const errors = [];
    if (name !== undefined && typeof name !== "string") {
      errors.push("Name must be a string");
    }
    if (role !== undefined && !["viewer", "analyst", "admin"].includes(role)) {
      errors.push("Role must be viewer, analyst, or admin");
    }
    if (status !== undefined && !["active", "inactive"].includes(status)) {
      errors.push("Status must be active or inactive");
    }
    return errors;
  })
};

const recordValidators = {
  createOrUpdate: validate((req) => {
    const { amount, type, category, date } = req.body;
    const errors = [];

    if (amount !== undefined && (typeof amount !== "number" || amount < 0)) {
      errors.push("Amount must be a non-negative number");
    }
    if (type !== undefined && !["income", "expense"].includes(type)) {
      errors.push("Type must be income or expense");
    }
    if (category !== undefined && typeof category !== "string") {
      errors.push("Category must be a string");
    }
    if (date !== undefined && Number.isNaN(new Date(date).getTime())) {
      errors.push("Date must be a valid date");
    }

    if (req.method === "POST") {
      if (amount === undefined) errors.push("Amount is required");
      if (!type) errors.push("Type is required");
      if (!category) errors.push("Category is required");
      if (!date) errors.push("Date is required");
    }

    return errors;
  })
};

module.exports = {
  authValidators,
  userValidators,
  recordValidators
};
