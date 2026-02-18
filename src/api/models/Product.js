const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  fullNameOfProduct: { type: String, required: true, unique: true },
  product: String,
  priseRange: {
    min: Number,
    max: Number,
  },
  url: String,
  variants: Array,
  lastParsed: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
