import { Router } from "express";
import {
  addShareholderDocument,
  deleteShareholderDocument,
  editShareholderDocument,
  getAllShareholderDocuments,
  getShareholderDocumentById,
} from "./ShareHolder.controler.js";
import { upload } from "../../utils/uploadPDF.js";

const router = Router();
router.route("/add").post(
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  addShareholderDocument
);

router.route("/update/:id").patch(
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  editShareholderDocument
);

router.route("/").get(getAllShareholderDocuments);
router.route("/:id").delete(deleteShareholderDocument);
router.get("/:id", getShareholderDocumentById);
export default router;
