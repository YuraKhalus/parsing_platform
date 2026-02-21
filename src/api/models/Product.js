const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  fullNameOfProduct: { type: String, required: true, unique: true },
  product: String,
  priseRange: {
    min: Number,
    max: Number,
  },
  priseHistory: [{
    prise: Number,
    date: {type: Date, default: Date.now}
  }],
  url: {type: String, required: true, unique: true},
  variants: Array,
  lastParsed: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
