import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import Banner from "./Banner.model.js";
import fs from "fs";
// Add new banner
export const addBanner = async (req, res) => {
  try {
    const { title,  order, isActive } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const file = req.files?.file;
    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const fileToUpload = Array.isArray(file) ? file[0] : file;

    const uploaded = await uploadOnCloudinary(fileToUpload.path, {
      folder: "banners",
      resource_type: "image",
    });

    fs.unlinkSync(fileToUpload.path);

    const newBanner = await Banner.create({
      title,
      imageUrl: uploaded.secure_url,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      message: "Banner created successfully",
      banner: newBanner,
    });
  } catch (error) {
    console.error("Banner upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ banners });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching banners", error: err.message });
  }
};

// Get single banner
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json({ banner });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching banner", error: err.message });
  }
};

// Update banner
export const updateBanner = async (req, res) => {
  try {
    const { title, link, order, isActive } = req.body;

    const file = req.files?.file;
    const updateData = {
      title,
      link,
      order,
      isActive,
    };

    if (file) {
      const fileToUpload = Array.isArray(file) ? file[0] : file;

      const uploaded = await uploadOnCloudinary(fileToUpload.path, {
        folder: "banners",
        resource_type: "image",
      });

      fs.unlinkSync(fileToUpload.path);
      updateData.imageUrl = uploaded.secure_url;
    }

    const updated = await Banner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Banner updated successfully",
      banner: updated,
    });
  } catch (error) {
    console.error("Banner update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete banner
export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting banner", error: err.message });
  }
};
