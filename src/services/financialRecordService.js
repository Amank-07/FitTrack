const mongoose = require("mongoose");
const { FinancialRecord } = require("../models/FinancialRecord");
const ApiError = require("../utils/ApiError");

const parseListFilters = (query) => {
  const filter = { isDeleted: false };
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.userId) filter.userId = query.userId;

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  return filter;
};

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const createRecord = async (payload) => FinancialRecord.create(payload);

const listRecords = async (query, currentUser) => {
  const filter = parseListFilters(query);

  if (currentUser.role !== "admin") {
    filter.userId = currentUser._id;
  }

  if (query.userId && currentUser.role !== "admin") {
    throw new ApiError(403, "Only admin can filter by userId");
  }

  const { page, limit, skip } = getPagination(query);
  const [items, totalItems] = await Promise.all([
    FinancialRecord.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
    FinancialRecord.countDocuments(filter)
  ]);

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit)
  };
};

const getRecordById = async (recordId, currentUser) => {
  if (!mongoose.Types.ObjectId.isValid(recordId)) {
    throw new ApiError(400, "Invalid record id");
  }

  const record = await FinancialRecord.findOne({
    _id: recordId,
    isDeleted: false
  });

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  if (currentUser.role !== "admin" && String(record.userId) !== String(currentUser._id)) {
    throw new ApiError(403, "You cannot access this record");
  }

  return record;
};

const updateRecord = async (recordId, updates, currentUser) => {
  const record = await getRecordById(recordId, currentUser);

  const allowedFields = ["amount", "type", "category", "date", "notes"];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      record[field] = updates[field];
    }
  }

  await record.save();
  return record;
};

const softDeleteRecord = async (recordId, currentUser) => {
  const record = await getRecordById(recordId, currentUser);
  record.isDeleted = true;
  await record.save();
};

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  softDeleteRecord
};
