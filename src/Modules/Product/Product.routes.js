import { Router } from "express";

import { upload } from "../../middlewares/FileUpload.middlwares.js";
import {
  deleteProduct,
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  bulkUploadProducts,
} from "./Product.controler.js";

const router = Router();

router.post("/add", upload.fields([{ name: "file", maxCount: 1 }]), addProduct);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.route("/bulk-upload").post(
  upload.fields([
    {
      name: "image",
      maxCount: 20,
    },
  ]),
  bulkUploadProducts
);
router.patch(
  "/update/:id",
  upload.fields([{ name: "file", maxCount: 1 }]),
  updateProduct
);

router.delete("/:id", deleteProduct);

export default router;
