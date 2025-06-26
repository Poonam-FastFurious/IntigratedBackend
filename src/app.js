import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import

import adminrouter from "../src/Modules/Admin/Admin.routes.js";

import corporate from "../src/Modules/Corporate/Corporates.routes.js";
import finance from "../src/Modules/Financial/Finance.routes.js";
import shareholders from "../src/Modules/ShareHolder/Shareholder.routes.js";
import team from "../src/Modules/TeamMenber/TeamMember.routes.js";
import website from "../src/Modules/WebsiteSetting/website.routes.js";
import Product from "../src/Modules/Product/Product.routes.js";
import dashboard from "../src/Modules/DashBoard/DashBoard.routes.js";
import banner from "../src/Modules/Banner/banner.Routes.js";
app.use("/api/v1/admin", adminrouter);
app.use("/api/v1/dashboard", dashboard);
app.use("/api/v1/corporate-governance", corporate);
app.use("/api/v1/finance", finance);
app.use("/api/v1/shareholders", shareholders);
app.use("/api/v1/banner", banner);
app.use("/api/v1/team", team);
app.use("/api/v1/website", website);
app.use("/api/v1/product", Product);

export { app };
