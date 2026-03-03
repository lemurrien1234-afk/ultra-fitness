import express from "express";

const router = express.Router();

/**
 * Хранилище кодов (в проде будет Redis/DB)
 * phone -> { code, expiresAt }
 */
const smsStore = new Map();

function normalizePhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");

  if (digits.length === 10) digits = "7" + digits;
  if (digits.length !== 11) return null;

  return "+7" + digits.slice(1);
}

/**
 * ===============================
 * 📲 Отправить код
 * POST /api/verify/send-code
 * ===============================
 */
router.post("/send-code", (req, res) => {
  const { phone } = req.body;

  const normalized = normalizePhone(phone);
  if (!normalized) {
    return res.status(400).json({ message: "Некорректный телефон" });
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString();

  smsStore.set(normalized, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 минут
  });

  // ❗ Для диплома — имитация SMS
  console.log(`📲 SMS для ${normalized}: ${code}`);

  res.json({
    success: true,
    message: "Код отправлен"
  });
});

/**
 * ===============================
 * ✅ Проверить код
 * POST /api/verify/check-code
 * ===============================
 */
router.post("/check-code", (req, res) => {
  const { phone, code } = req.body;

  const normalized = normalizePhone(phone);
  if (!normalized) {
    return res.status(400).json({ message: "Некорректный телефон" });
  }

  const record = smsStore.get(normalized);
  if (!record) {
    return res.status(400).json({ message: "Код не запрашивался" });
  }

  if (Date.now() > record.expiresAt) {
    smsStore.delete(normalized);
    return res.status(400).json({ message: "Код истёк" });
  }

  if (record.code !== code) {
    return res.status(400).json({ message: "Неверный код" });
  }

  smsStore.delete(normalized);

  res.json({ success: true });
});

export default router;