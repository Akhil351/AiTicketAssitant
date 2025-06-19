import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { onUserSignUp } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";

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

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignUp, onTicketCreated], 
  })
);
app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
