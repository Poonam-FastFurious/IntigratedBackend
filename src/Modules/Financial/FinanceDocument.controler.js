import { supabase } from "../../utils/supabase.js";
import { FinanceDocument } from "./FinanceDocument.model.js";

export const addFinanceDocument = async (req, res) => {
  try {
    const { title, documentType, year, quarter } = req.body;

    if (!title || !documentType) {
      return res
        .status(400)
        .json({ message: "Title and Document Type are required" });
    }

    if (!req.files || !req.files.file || !req.files.file[0]) {
      return res.status(400).json({ message: "File is required" });
    }

    const file = req.files.file[0]; // ✔ multer file
    const originalName = file.originalname || "document.pdf";
    const fileName = `${Date.now()}-${originalName}`;

    // Upload
    const { error } = await supabase.storage
      .from("intigrated")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }

    // Public URL
    const publicUrl = supabase.storage.from("intigrated").getPublicUrl(fileName)
      .data.publicUrl;

    const newDoc = await FinanceDocument.create({
      title,
      documentType,
      fileType: file.mimetype,
      fileUrl: publicUrl,
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

export const editFinanceDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, documentType, year, quarter } = req.body;

    const doc = await FinanceDocument.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // If new file uploaded
    if (req.files?.file && req.files.file[0]) {
      const file = req.files.file[0]; // ✔ multer

      const originalName = file.originalname || "document.pdf";
      const newFileName = `${Date.now()}-${originalName}`;

      // Upload new file
      const { error } = await supabase.storage
        .from("intigrated")
        .upload(newFileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
      }

      // Public URL
      const newUrl = supabase.storage
        .from("intigrated")
        .getPublicUrl(newFileName).data.publicUrl;

      // Delete old file
      if (doc.fileUrl) {
        const oldName = doc.fileUrl.split("/").pop();
        await supabase.storage.from("intigrated").remove([oldName]);
      }

      doc.fileUrl = newUrl;
      doc.fileType = file.mimetype;
    }

    // Update fields
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
