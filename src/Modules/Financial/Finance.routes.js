import { Router } from "express";
import { upload } from "../../middlewares/FileUpload.middlwares.js";
import {
  addFinanceDocument,
  deleteFinanceDocument,
  editFinanceDocument,
  getFinanceDocumentById,
  getFinanceDocuments,
} from "./FinanceDocument.controler.js";

const router = Router();
router.route("/add").post(
  upload.fields([
    {
      name: "file",
      maxCount: 20,
    },
  ]),
  addFinanceDocument
);
router.route("/update/:id").patch(
  upload.fields([
    {
      name: "file",
      maxCount: 20,
    },
  ]),
  editFinanceDocument
);
router.route("/:id").delete(deleteFinanceDocument);
router.route("/").get(getFinanceDocuments);
router.get("/:id", getFinanceDocumentById);
export default router;
