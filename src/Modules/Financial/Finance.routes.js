import { Router } from "express";
import {
  addFinanceDocument,
  deleteFinanceDocument,
  editFinanceDocument,
  getFinanceDocumentById,
  getFinanceDocuments,
} from "./FinanceDocument.controler.js";
import { upload } from "../../utils/uploadPDF.js";

const router = Router();
router
  .route("/add")
  .post(upload.fields([{ name: "file", maxCount: 1 }]), addFinanceDocument);

router.route("/update/:id").patch(
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  editFinanceDocument
);

router.route("/:id").delete(deleteFinanceDocument);
router.route("/").get(getFinanceDocuments);
router.get("/:id", getFinanceDocumentById);
export default router;
