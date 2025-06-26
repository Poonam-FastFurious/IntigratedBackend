import { Router } from "express";
import { upload } from "../../middlewares/FileUpload.middlwares.js";
import {
  addBanner,
  deleteBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
} from "./bannerController.js";

const router = Router();

// Add banner
router.route("/add").post(
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  addBanner
);

// Get all banners
router.route("/").get(getAllBanners);

// Update banner
router.route("/update/:id").patch(
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  updateBanner
);

// Delete banner
router.route("/:id").delete(deleteBanner);

// Get banner by ID
router.get("/:id", getBannerById);

export default router;
