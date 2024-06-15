const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      required: true,
      default:{
        address:String,
        city:String,
        state:String,
        postalCode:String,
        landMark:String
      }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userDetails", userSchema);
