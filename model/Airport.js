const mongoose = require("mongoose");
// creating airport schema
const airportSchema = new mongoose.Schema(
  {
    aiportId: {
      type: String,
    },
    airportName: {
      type: String,
      trim: true,
      require: true,
    },
    fuelCapacity: {
      type: Number,
      require: true,
      trim: true,
    },
    fuelAvailable: {
      type: Number,
      require: true,
      trim: true,
    },
  },

  { timestamps: true }
  // creating airport model
);
const Airport = new mongoose.model("airport", airportSchema);
// exporting airport model
module.exports = Airport;
