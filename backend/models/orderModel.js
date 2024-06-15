const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    
    buyer: {
      type: mongoose.ObjectId,
      ref: "userDetails",
    },

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Shipped", "Deliverd", "Cancelled"],
    },

    code: {
      type:String
    },

    orderId:{
      type:String
    },
    transaction:{
      type:Date
    },
    tracking:{
      type:String,
      default: "Not Yet Provided"
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Order", orderSchema);
