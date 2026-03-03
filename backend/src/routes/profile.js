import express from "express";
import prisma from "../db.js";
import auth from "../middlewares/auth.middleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/avatars",
  filename: (req, file, cb) =>
    cb(null, `user_${req.user.id}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

router.get("/me", auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, avatar: true, role: true }
  });
  res.json(user);
});

router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  const avatar = `/uploads/avatars/${req.file.filename}`;

  await prisma.user.update({
    where: { id: req.user.id },
    data: { avatar }
  });

  res.json({ success: true, avatar });
});

export default router;