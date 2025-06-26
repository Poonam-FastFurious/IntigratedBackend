import mongoose from "mongoose";

const financeDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: [
      "Financial Results",
      "Annual Report",
      "Annual Report subsidiaries",
      "Investor Presentation",
    ],
  },

  fileType: {
    type: String, // e.g., "application/pdf", "audio/mpeg"
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    default: null,
  },
  quarter: {
    type: String,
    enum: ["Q1", "Q2", "Q3", "Q4", "Full Year", ""],
    default: "",
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const FinanceDocument = mongoose.model(
  "FinanceDocument",
  financeDocumentSchema
);
