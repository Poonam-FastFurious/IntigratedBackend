import { Router } from "express";
import { upload } from "../../middlewares/FileUpload.middlwares.js";
import {
  addTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
} from "./TeamMember.Controler.js";

const router = Router();

router.post(
  "/add",
  upload.fields([{ name: "file", maxCount: 1 }]),
  addTeamMember
);
router.get("/", getAllTeamMembers);
router.get("/:id", getTeamMemberById);
router.patch(
  "/update/:id",
  upload.fields([{ name: "file", maxCount: 1 }]),
  updateTeamMember
);
router.delete("/:id", deleteTeamMember);

export default router;
