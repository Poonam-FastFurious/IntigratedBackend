import { CorporateGovernance } from "./Corporategovernance.model.js";
import { supabase } from "../../utils/supabase.js";

export const addCorporateDocument = async (req, res) => {
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

    const file = req.files.file[0]; // MULTER FILE
    const originalName = file.originalname || "document.pdf";
    const fileName = `${Date.now()}-${originalName}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
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

    // Save DB
    const doc = await CorporateGovernance.create({
      title,
      documentType,
      fileUrl: publicUrl,
      year: year || null,
      quarter: quarter || "",
    });

    return res.status(201).json({
      message: "Corporate document uploaded successfully",
      document: doc,
    });
  } catch (error) {
    console.error("Supabase upload error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
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

    // If file is updated
    if (req.files?.file && req.files.file[0]) {
      const file = req.files.file[0]; // MULTER FILE

      const originalName = file.originalname || "document.pdf";
      const newFileName = `${Date.now()}-${originalName}`;

      // Upload new file to Supabase
      const { data, error } = await supabase.storage
        .from("intigrated")
        .upload(newFileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
      }

      // New Public URL
      const newUrl = supabase.storage
        .from("intigrated")
        .getPublicUrl(newFileName).data.publicUrl;

      // Delete old file from Supabase
      if (doc.fileUrl) {
        const oldFileName = doc.fileUrl.split("/").pop();
        await supabase.storage.from("intigrated").remove([oldFileName]);
      }

      doc.fileUrl = newUrl;
    }

    // Update other fields
    doc.title = title || doc.title;
    doc.documentType = documentType || doc.documentType;
    doc.year = year || null;
    doc.quarter = quarter || "";

    await doc.save();

    return res.status(200).json({
      message: "Corporate document updated successfully",
      document: doc,
    });
  } catch (error) {
    console.error("Supabase Update error:", error);
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
