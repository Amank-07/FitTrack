const { FinancialRecord } = require("../models/FinancialRecord");

const buildAccessMatch = (currentUser) =>
  currentUser.role === "admin"
    ? { isDeleted: false }
    : { isDeleted: false, userId: currentUser._id };

const getSummary = async (currentUser) => {
  const match = buildAccessMatch(currentUser);

  const [result] = await FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
        }
      }
    }
  ]);

  const totalIncome = result?.totalIncome || 0;
  const totalExpense = result?.totalExpense || 0;
  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense
  };
};

const getCategoryWiseAggregation = async (currentUser) => {
  const match = buildAccessMatch(currentUser);

  return FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        totalAmount: { $sum: "$amount" }
      }
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        totalAmount: 1
      }
    },
    { $sort: { category: 1 } }
  ]);
};

const getMonthlyTrends = async (currentUser) => {
  const match = buildAccessMatch(currentUser);

  return FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type"
        },
        totalAmount: { $sum: "$amount" }
      }
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        type: "$_id.type",
        totalAmount: 1
      }
    },
    { $sort: { year: 1, month: 1 } }
  ]);
};

module.exports = {
  getSummary,
  getCategoryWiseAggregation,
  getMonthlyTrends
};
