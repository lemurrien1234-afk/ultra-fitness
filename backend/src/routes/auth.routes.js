import express from "express";
import prisma from "../db.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * body: { name, email, password }
 * return: { token, user }
 */
router.post("/register", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "").trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Заполните имя, email и пароль" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email уже используется" });

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, passwordHash }
    });

    const token = signToken({ id: user.id, role: user.role });

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Ошибка регистрации" });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 * return: { token, user }
 */
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Введите email и пароль" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Неверные данные" });

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Неверные данные" });

    const token = signToken({ id: user.id, role: user.role });

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Ошибка входа" });
  }
});

export default router;