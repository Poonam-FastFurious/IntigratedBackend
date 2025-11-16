import { Router } from "express";

import {
  addCorporateDocument,
  deleteCorporateDocument,
  editCorporateDocument,
  getCorporateDocumentById,
  getCorporateDocuments,
} from "./CorporateGovernance.controler.js";
import { upload } from "../../utils/uploadPDF.js";

const router = Router();
router.post(
  "/add",
  upload.fields([{ name: "file", maxCount: 1 }]),
  addCorporateDocument
);

router.patch(
  "/update/:id",
  upload.fields([{ name: "file", maxCount: 1 }]),
  editCorporateDocument
);
router.route("/").get(getCorporateDocuments);
router.route("/:id").delete(deleteCorporateDocument);
router.get("/:id", getCorporateDocumentById);

export default router;
