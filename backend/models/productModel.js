const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: String,
      required: true
    },
    shipping: {
      type: Boolean,
      default: true,
    },
    photo:{
      type:mongoose.ObjectId,
      ref:"Photo"
    },
    available:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
