import { supabase } from "../../utils/supabase.js";
import { ShareholderDocument } from "./ShareholderDocument.model.js";
export const addShareholderDocument = async (req, res) => {
  try {
    const { title, documentType, year, quarter } = req.body;

    if (!title || !documentType) {
      return res
        .status(400)
        .json({ message: "Title and Document Type are required" });
    }

    if (!req.files?.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const file = Array.isArray(req.files.file)
      ? req.files.file[0]
      : req.files.file;

    const original = file.originalname || "document.pdf";
    const fileName = `${Date.now()}-${original}`;

    const { error } = await supabase.storage
      .from("intigrated")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const publicUrl = supabase.storage.from("intigrated").getPublicUrl(fileName)
      .data.publicUrl;

    const newDoc = await ShareholderDocument.create({
      title,
      documentType,
      fileType: file.mimetype,
      fileUrl: publicUrl,
      year: year || null,
      quarter: quarter || "",
    });

    return res.status(201).json({
      message: "Shareholder document uploaded successfully",
      document: newDoc,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
export const editShareholderDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, documentType, year, quarter } = req.body;

    const doc = await ShareholderDocument.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (req.files?.file) {
      const file = Array.isArray(req.files.file)
        ? req.files.file[0]
        : req.files.file;

      const original = file.originalname || "document.pdf";
      const newFileName = `${Date.now()}-${original}`;

      const { error } = await supabase.storage
        .from("intigrated")
        .upload(newFileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) return res.status(400).json({ message: error.message });

      const newUrl = supabase.storage
        .from("intigrated")
        .getPublicUrl(newFileName).data.publicUrl;

      // Delete old file
      if (doc.fileUrl) {
        const oldFile = doc.fileUrl.split("/").pop();
        await supabase.storage.from("intigrated").remove([oldFile]);
      }

      doc.fileUrl = newUrl;
      doc.fileType = file.mimetype;
    }

    // fields update
    doc.title = title || doc.title;
    doc.documentType = documentType || doc.documentType;
    doc.year = year || null;
    doc.quarter = quarter || "";

    await doc.save();

    return res.status(200).json({
      message: "Shareholder document updated successfully",
      document: doc,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const getAllShareholderDocuments = async (req, res) => {
  try {
    const documents = await ShareholderDocument.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Documents retrieved successfully", documents });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getShareholderDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await ShareholderDocument.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res
      .status(200)
      .json({ message: "Document retrieved successfully", document: doc });
  } catch (error) {
    console.error("Fetch by ID error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ DELETE
export const deleteShareholderDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ShareholderDocument.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Document not found" });
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
