import { Router } from "express";
import { upload } from "../../middlewares/FileUpload.middlwares.js";
import {
  addShareholderDocument,
  deleteShareholderDocument,
  editShareholderDocument,
  getAllShareholderDocuments,
  getShareholderDocumentById,
} from "./ShareHolder.controler.js";

const router = Router();
router.route("/add").post(
  upload.fields([
    {
      name: "file",
      maxCount: 20,
    },
  ]),
  addShareholderDocument
);

router.route("/").get(getAllShareholderDocuments);
router.route("/update/:id").patch(
  upload.fields([
    {
      name: "file",
      maxCount: 20,
    },
  ]),
  editShareholderDocument
);
router.route("/:id").delete(deleteShareholderDocument);
router.get("/:id", getShareholderDocumentById);
export default router;
