const mongoose = require("mongoose");
// create user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);
// create user model
const User = new mongoose.model("user", userSchema);
// exporting user model
module.exports = User;
