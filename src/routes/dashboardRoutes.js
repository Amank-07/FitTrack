const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware, authorizeRoles("analyst", "admin"));

router.get("/summary", dashboardController.getSummary);
router.get("/category-wise", dashboardController.getCategoryWiseAggregation);
router.get("/monthly-trends", dashboardController.getMonthlyTrends);

module.exports = router;
