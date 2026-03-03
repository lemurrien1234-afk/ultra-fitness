import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";


import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import bookingRoutes from "./routes/bookings.routes.js";
import verifyRoutes from "./routes/verify.routes.js";

const app = express();

// чтобы корректно работать с путями в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// статика для аватарок (чтобы /uploads/avatars/... открывалось)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/verify", verifyRoutes);

export default app;