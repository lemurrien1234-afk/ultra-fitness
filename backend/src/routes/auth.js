const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { signToken } = require("../utils/jwt");
const { authRequired } = require("../middleware/auth");

function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role || "CLIENT",
    avatar: u.avatar || null,
  };
}

router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Введите имя" });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Некорректный email" });
    }
    if (!password || password.length < 5) {
      return res.status(400).json({ message: "Пароль должен быть не менее 5 символов" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Пользователь с таким email уже существует" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hash },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role || "CLIENT" });

    return res.status(201).json({ token, user: publicUser(user) });
  } catch (e) {
    console.error("REGISTER_ERROR:", e);
    return res.status(500).json({ message: "Ошибка регистрации" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Введите email и пароль" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role || "CLIENT" });

    return res.json({ token, user: publicUser(user) });
  } catch (e) {
    console.error("LOGIN_ERROR:", e);
    return res.status(500).json({ message: "Ошибка входа" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Нет доступа" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    return res.json({ user: publicUser(user) });
  } catch (e) {
    console.error("ME_ERROR:", e);
    return res.status(500).json({ message: "Ошибка" });
  }
});

module.exports = router;
