import mongoose from "mongoose";
const corporateGovernanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: ["Policy", "Corporate Governance Report"],
  },
  fileUrl: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    default: null, // Optional
  },
  quarter: {
    type: String,
    enum: ["Q1", "Q2", "Q3", "Q4", "Full Year", ""],
    default: "", // Optional
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

export const CorporateGovernance = mongoose.model(
  "CorporateGovernance",
  corporateGovernanceSchema
);
