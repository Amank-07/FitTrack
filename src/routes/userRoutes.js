const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { userValidators } = require("../middleware/validate");

const router = express.Router();

router.use(authMiddleware, authorizeRoles("admin"));

router.post("/", userValidators.create, userController.createUser);
router.get("/", userController.listUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id", userValidators.update, userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
