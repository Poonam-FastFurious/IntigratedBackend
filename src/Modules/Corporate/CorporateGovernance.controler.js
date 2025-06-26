import fs from "fs";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { CorporateGovernance } from "./Corporategovernance.model.js";

export const addCorporateDocument = async (req, res) => {
  try {
    const { title, documentType, year, quarter } = req.body;

    if (!title || !documentType) {
      return res
        .status(400)
        .json({ message: "Title and Document Type are required" });
    }

    // File upload
    let fileUrl = "";
    if (req.files?.file) {
      const file = Array.isArray(req.files.file)
        ? req.files.file[0]
        : req.files.file;

      const uploaded = await uploadOnCloudinary(file.path, {
        resource_type: "raw",
        folder: "corporate-governance",
      });

      fileUrl = uploaded?.secure_url;

      fs.unlinkSync(file.path);
    }

    if (!fileUrl) {
      return res
        .status(400)
        .json({ message: "File is required and must be uploaded" });
    }

    const doc = await CorporateGovernance.create({
      title,
      documentType,
      fileUrl,
      year: year || null,
      quarter: quarter || "",
    });

    res.status(201).json({
      message: "Corporate document uploaded successfully",
      document: doc,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCorporateDocuments = async (req, res) => {
  try {
    const { documentType, year, quarter } = req.query;

    const filter = {};
    if (documentType) filter.documentType = documentType;
    if (year) filter.year = year;
    if (quarter) filter.quarter = quarter;

    const documents = await CorporateGovernance.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Corporate documents retrieved successfully",
      documents,
    });
  } catch (error) {
    console.error("Error retrieving documents:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editCorporateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, documentType, year, quarter } = req.body;

    const doc = await CorporateGovernance.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Handle optional file update
    if (req.files?.file) {
      const file = Array.isArray(req.files.file)
        ? req.files.file[0]
        : req.files.file;

      const uploaded = await uploadOnCloudinary(file.path, {
        resource_type: "raw",
        folder: "corporate-governance",
      });

      fs.unlinkSync(file.path);

      doc.fileUrl = uploaded?.secure_url;
    }

    // Update fields
    doc.title = title || doc.title;
    doc.documentType = documentType || doc.documentType;
    doc.year = year || null;
    doc.quarter = quarter || "";

    await doc.save();

    res.status(200).json({
      message: "Corporate document updated successfully",
      document: doc,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCorporateDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await CorporateGovernance.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    await CorporateGovernance.findByIdAndDelete(id);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCorporateDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await CorporateGovernance.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({
      message: "Corporate document retrieved successfully",
      document,
    });
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
