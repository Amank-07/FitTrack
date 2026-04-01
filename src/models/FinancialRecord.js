const mongoose = require("mongoose");

const RECORD_TYPES = ["income", "expense"];

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: RECORD_TYPES,
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      default: "",
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

financialRecordSchema.index({ date: -1 });
financialRecordSchema.index({ category: 1 });
financialRecordSchema.index({ userId: 1, date: -1 });

module.exports = {
  FinancialRecord: mongoose.model("FinancialRecord", financialRecordSchema),
  RECORD_TYPES
};
