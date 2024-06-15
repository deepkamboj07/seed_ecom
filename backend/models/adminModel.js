const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  role:{
    type: String,
    default: "SuperAdmin"
  }
});

module.exports = mongoose.model("Admin", adminSchema);
