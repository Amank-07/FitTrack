const financialRecordService = require("../services/financialRecordService");
const asyncHandler = require("../utils/asyncHandler");

const createRecord = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    userId: req.user.role === "admin" && req.body.userId ? req.body.userId : req.user._id
  };

  const record = await financialRecordService.createRecord(payload);
  res.status(201).json({
    success: true,
    message: "Record created successfully",
    data: record
  });
});

const listRecords = asyncHandler(async (req, res) => {
  const result = await financialRecordService.listRecords(req.query, req.user);
  res.status(200).json({
    success: true,
    data: result
  });
});

const getRecordById = asyncHandler(async (req, res) => {
  const record = await financialRecordService.getRecordById(req.params.id, req.user);
  res.status(200).json({
    success: true,
    data: record
  });
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await financialRecordService.updateRecord(req.params.id, req.body, req.user);
  res.status(200).json({
    success: true,
    message: "Record updated successfully",
    data: record
  });
});

const deleteRecord = asyncHandler(async (req, res) => {
  await financialRecordService.softDeleteRecord(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: "Record deleted successfully"
  });
});

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};
