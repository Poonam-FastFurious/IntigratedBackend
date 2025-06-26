import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import Product from "./Product.model.js";
import fs from "fs";
export const addProduct = async (req, res) => {
  try {
    const { name, brand } = req.body;
    const file = req.files?.file?.[0]; // expects file input named 'file'

    if (!name || !brand || !file) {
      return res
        .status(400)
        .json({ message: "Name, brand, and image are required" });
    }

    const upload = await uploadOnCloudinary(file.path, {
      folder: "products",
    });

    fs.unlinkSync(file.path);

    const product = await Product.create({
      name,
      brand,
      imageUrl: upload.secure_url,
    });

    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: err.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { name, brand } = req.body;
    const file = req.files?.file?.[0]; // optional new image
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let imageUrl = product.imageUrl;

    if (file) {
      const upload = await uploadOnCloudinary(file.path, {
        folder: "products",
      });
      fs.unlinkSync(file.path);
      imageUrl = upload.secure_url;
    }

    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.imageUrl = imageUrl;

    await product.save();

    res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message });
  }
};

export const bulkUploadProducts = asyncHandler(async (req, res) => {
  if (!req.body.products || !Array.isArray(req.body.products)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product data" });
  }

  try {
    const createdProducts = await Product.insertMany(req.body.products);

    return res.status(201).json({
      success: true,
      message: "Products uploaded successfully",
      products: createdProducts,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
});
