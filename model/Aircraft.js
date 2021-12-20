const mongoose = require("mongoose");
// creating aircraft Schema
const airctaftSchema = new mongoose.Schema(
  {
    aircraftNo: {
      type: String,
      trim: true,
      require: true,
    },
    airline: {
      type: String,
      require: true,
      trim: true,
    },
  },
  { timestamps: true }
);
// creating aircraft model
const Aircraft = new mongoose.model("aircraft", airctaftSchema);
// exporting aircraft model
module.exports = Aircraft;
