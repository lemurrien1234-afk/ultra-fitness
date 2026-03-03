require("dotenv").config();

const PORT = Number(process.env.PORT || 5000);

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env");
}

const CORS_ORIGIN = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

module.exports = { PORT, JWT_SECRET, CORS_ORIGIN };