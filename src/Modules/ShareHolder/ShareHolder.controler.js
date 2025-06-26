import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { ShareholderDocument } from "./ShareholderDocument.model.js";

export const addShareholderDocument = async (req, res) => {
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

    // Optional file size validation (e.g., 10MB max for Cloudinary free plan)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (fileToUpload.size > MAX_FILE_SIZE) {
      fs.unlinkSync(fileToUpload.path);
      return res.status(400).json({ message: "Max upload size is 10MB." });
    }

    const uploaded = await uploadOnCloudinary(fileToUpload.path, {
      resource_type: "raw",
      folder: "shareholder-documents",
    });

    try {
      fs.unlinkSync(fileToUpload.path);
    } catch (err) {
      console.warn("Cleanup failed:", err.message);
    }

    const newDoc = await ShareholderDocument.create({
      title,
      documentType,
      fileType,
      fileUrl: uploaded.secure_url,
      year: year || null,
      quarter: quarter || "",
    });

    res.status(201).json({
      message: "Shareholder document uploaded successfully",
      document: newDoc,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

export const editShareholderDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, documentType, year, quarter } = req.body;

    const document = await ShareholderDocument.findById(id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    let fileType = document.fileType;
    let fileUrl = document.fileUrl;

    if (req.files?.file) {
      const file = Array.isArray(req.files.file)
        ? req.files.file[0]
        : req.files.file;

      if (file.size > 10 * 1024 * 1024) {
        fs.unlinkSync(file.path);
        return res.status(400).json({ message: "Max upload size is 10MB." });
      }

      const uploaded = await uploadOnCloudinary(file.path, {
        resource_type: "raw",
        folder: "shareholder-documents",
      });

      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn("Cleanup failed:", err.message);
      }

      fileType = file.mimetype;
      fileUrl = uploaded.secure_url;
    }

    const updated = await ShareholderDocument.findByIdAndUpdate(
      id,
      { title, documentType, year, quarter, fileType, fileUrl },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Document updated successfully", document: updated });
  } catch (error) {
    console.error("Edit error:", error);
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
