const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");

const getSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary(req.user);
  res.status(200).json({
    success: true,
    data
  });
});

const getCategoryWiseAggregation = asyncHandler(async (req, res) => {
  const data = await dashboardService.getCategoryWiseAggregation(req.user);
  res.status(200).json({
    success: true,
    data
  });
});

const getMonthlyTrends = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMonthlyTrends(req.user);
  res.status(200).json({
    success: true,
    data
  });
});

module.exports = {
  getSummary,
  getCategoryWiseAggregation,
  getMonthlyTrends
};
