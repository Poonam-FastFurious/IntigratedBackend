import mongoose from "mongoose";

const shareholderDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: [
      "agm-transcript",
      "annual-return",
      "buy-back",
      "buy-back-2022",
      "credit-rating",
      "dematerialisation-of-shares",
      "clause-305-of-lodr",
      "clause-46-of-lodr",
      "unclaimed-dividend",
      "kyc-forms",
      "listing",
      "nomination-facility",
      "notices",
      "online-dispute-resolution",
      "registrar-share-transfer-agents",
      "scheme-of-arrangement",
      "secretarial-compliance-report",
      "shareHolding-pattern",
      "share-transfer-system",
      "shareholding-service",
      "survey-form",
      "stock-exchange-filings",
      "tds-instructions",
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

export const ShareholderDocument = mongoose.model(
  "ShareholderDocument",
  shareholderDocumentSchema
);
