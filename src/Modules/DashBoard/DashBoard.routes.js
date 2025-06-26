import { Router } from "express";
import {
 
  getDashboardCounts,
} from "./DashBoard.controler.js";

const router = Router();
router.route("/").get(getDashboardCounts);
export default router;
