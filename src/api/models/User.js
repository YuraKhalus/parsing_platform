const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, reequired: true, unique: true },
  username: String,
  savedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
