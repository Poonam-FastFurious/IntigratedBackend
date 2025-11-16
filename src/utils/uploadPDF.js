import multer from "multer";
import { supabase } from "./supabase.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadPDFController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF uploaded" });
    }

    const file = req.file;

    // FIX: if originalname missing
    const original = file.originalname || "document.pdf";
    const fileName = `${Date.now()}-${original}`;

    const { data, error } = await supabase.storage
      .from("intigrated")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { publicUrl } = supabase.storage
      .from("intigrated")
      .getPublicUrl(fileName).data;

    return res.json({
      message: "PDF uploaded successfully",
      url: publicUrl,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error while uploading PDF",
      details: err.message,
    });
  }
};
