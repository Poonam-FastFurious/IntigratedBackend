import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { FinanceDocument } from "./FinanceDocument.model.js";
import fs from "fs";

export const addFinanceDocument = async (req, res) => {
  try {
    const { title, documentType, year, quarter } = req.body;

    if (!title || !documentType) {
      return res
        .status(400)
        .json({ message: "Title and Document Type are required" });
    }

    const file = req.files?.file;
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileToUpload = Array.isArray(file) ? file[0] : file;
    const fileType = fileToUpload.mimetype;

    const uploaded = await uploadOnCloudinary(fileToUpload.path, {
      resource_type: "raw",
      folder: "finance-documents",
    });

    fs.unlinkSync(fileToUpload.path);

    const newDoc = await FinanceDocument.create({
      title,
      documentType,
      fileType,
      fileUrl: uploaded.secure_url,
      year: year || null,
      quarter: quarter || "",
    });

    res.status(201).json({
      message: "Finance document uploaded successfully",
      document: newDoc,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFinanceDocuments = async (req, res) => {
  try {
    const { documentType, year, quarter } = req.query;

    const filter = {};
    if (documentType) filter.documentType = documentType;
    if (year) filter.year = year;
    if (quarter) filter.quarter = quarter;

    const documents = await FinanceDocument.find(filter).sort({
      uploadedAt: -1,
    });

    res.status(200).json({
      message: "Finance documents retrieved successfully",
      documents,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editFinanceDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, documentType, year, quarter } = req.body;

    const doc = await FinanceDocument.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Handle optional file update
    if (req.files?.file) {
      const fileToUpload = Array.isArray(req.files.file)
        ? req.files.file[0]
        : req.files.file;

      const uploaded = await uploadOnCloudinary(fileToUpload.path, {
        resource_type: "raw",
        folder: "finance-documents",
      });

      fs.unlinkSync(fileToUpload.path);

      doc.fileUrl = uploaded.secure_url;
      doc.fileType = fileToUpload.mimetype;
    }

    doc.title = title || doc.title;
    doc.documentType = documentType || doc.documentType;
    doc.year = year || null;
    doc.quarter = quarter || "";

    await doc.save();

    res.status(200).json({
      message: "Finance document updated successfully",
      document: doc,
    });
  } catch (error) {
    console.error("Edit error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteFinanceDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await FinanceDocument.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    await FinanceDocument.findByIdAndDelete(id);

    res.status(200).json({ message: "Finance document deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFinanceDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await FinanceDocument.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({
      message: "Finance document retrieved successfully",
      document,
    });
  } catch (error) {
    console.error("Fetch by ID error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
