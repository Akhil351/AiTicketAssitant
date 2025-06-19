import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/user.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3510;
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

connectDB();

app.use("/api/auth", router);

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
