const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    passwordHash: { type: String, required: true },

    role: { type: String, default: "client" }, // client / trainer / admin
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
