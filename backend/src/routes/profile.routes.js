import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import prisma from "../db.js";
import auth from "../middlewares/auth.middleware.js";
import { comparePassword, hashPassword } from "../utils/password.js";

const router = express.Router();

// пути в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads/avatars (абсолютный путь)
const avatarsDir = path.join(__dirname, "..", "..", "uploads", "avatars");

// ВАЖНО: recursive, чтобы не падало, если папка уже есть
fs.mkdirSync(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".png";
    cb(null, `user_${req.user.id}${ext}`);
  }
});

const upload = multer({ storage });

/**
 * GET /api/profile/me
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, avatar: true, role: true }
    });
    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Ошибка профиля" });
  }
});

/**
 * POST /api/profile/avatar
 * form-data: avatar=<file>
 */
router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Файл не загружен" });

    const avatar = `/uploads/avatars/${req.file.filename}`;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar }
    });

    return res.json({ success: true, avatar });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Ошибка загрузки фото" });
  }
});

/**
 * PUT /api/profile/email
 * body: { email }
 */
router.put("/email", auth, async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Email обязателен" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: "Этот email уже занят" });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { email }
    });

    return res.json({ success: true, email });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Ошибка сохранения email" });
  }
});

/**
 * PUT /api/profile/password
 * body: { oldPassword, newPassword }
 */
router.put("/password", auth, async (req, res) => {
  try {
    const oldPassword = String(req.body?.oldPassword || "");
    const newPassword = String(req.body?.newPassword || "");

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Заполните поля" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    const ok = await comparePassword(oldPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Старый пароль неверный" });

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash }
    });

    return res.json({ success: true, message: "Пароль обновлен" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Ошибка смены пароля" });
  }
});

export default router;