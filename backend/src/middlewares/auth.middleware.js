import { verifyToken } from "../utils/jwt.js";

export default function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Нет токена авторизации" });
  }

  try {
    const payload = verifyToken(token);

    if (!payload?.id) {
      return res.status(401).json({ message: "Неверный токен" });
    }

    req.user = payload; // { id, role }
    return next();
  } catch {
    return res.status(401).json({ message: "Неверный или просроченный токен" });
  }
}