import express from "express";
import prisma from "../db.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * ===============================
 * 📌 Записаться на тренировку
 * POST /api/bookings
 * body: { trainingId }
 * ===============================
 */
router.post("/", auth, async (req, res) => {
  try {
    const { trainingId } = req.body;
    const userId = req.user.id;

    if (!trainingId) {
      return res.status(400).json({ message: "trainingId обязателен" });
    }

    // проверяем тренировку
    const training = await prisma.training.findUnique({
      where: { id: Number(trainingId) }
    });

    if (!training) {
      return res.status(404).json({ message: "Тренировка не найдена" });
    }

    // считаем занятые места
    const bookedCount = await prisma.booking.count({
      where: {
        trainingId: Number(trainingId),
        status: "active"
      }
    });

    if (bookedCount >= training.capacity) {
      return res.status(400).json({ message: "Нет свободных мест" });
    }

    // проверка дубля
    const existing = await prisma.booking.findUnique({
      where: {
        userId_trainingId: {
          userId,
          trainingId: Number(trainingId)
        }
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Вы уже записаны" });
    }

    // создаём запись
    const booking = await prisma.booking.create({
      data: {
        userId,
        trainingId: Number(trainingId)
      }
    });

    res.json({
      success: true,
      booking
    });

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ message: "Ошибка записи" });
  }
});

/**
 * ===============================
 * 📌 Мои записи
 * GET /api/bookings/my
 * ===============================
 */
router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        training: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(bookings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка загрузки записей" });
  }
});

/**
 * ===============================
 * ❌ Отмена записи
 * DELETE /api/bookings/:id
 * ===============================
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.userId !== userId) {
      return res.status(404).json({ message: "Запись не найдена" });
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "cancelled" }
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка отмены" });
  }
});

export default router;