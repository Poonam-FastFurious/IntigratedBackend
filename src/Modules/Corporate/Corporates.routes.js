import { Router } from "express";

import { upload } from "../../middlewares/FileUpload.middlwares.js";
import {
  addCorporateDocument,
  deleteCorporateDocument,
  editCorporateDocument,
  getCorporateDocumentById,
  getCorporateDocuments,
} from "./CorporateGovernance.controler.js";

const router = Router();
router.route("/add").post(
  upload.fields([
    {
      name: "file",
      maxCount: 20,
    },
  ]),
  addCorporateDocument
);
router.route("/").get(getCorporateDocuments);
router.route("/update/:id").patch(
  upload.fields([
    {
      name: "file",
      maxCount: 20,
    },
  ]),
  editCorporateDocument
);
router.route("/:id").delete(deleteCorporateDocument);
router.get("/:id", getCorporateDocumentById);

export default router;
