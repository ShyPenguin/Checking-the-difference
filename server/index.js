import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";
import helmet from "helmet";
import departmentRoutes from "./routes/departmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import {
  verifyToken,
  roleAuth,
  deptAuth,
} from "./middlewares/authMiddleWare.js";

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
/* DATABASE */
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3001);
    console.log("Connected to Mongoose");
  })
  .catch((err) => console.log(err));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/admin", verifyToken, roleAuth("admin"), adminRoutes);
app.use(
  "/departments/:department",
  verifyToken,
  roleAuth(["user", "admin"]),
  deptAuth,
  departmentRoutes
);
