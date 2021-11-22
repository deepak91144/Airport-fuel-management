const mongoose = require("mongoose");
// creating transaction schema
const transactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      trim: true,
      require: true,
    },
    airportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "airport",
    },
    aircraftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "aircraft",
    },
    quantity: {
      type: Number,
    },
    TransactionIdParent: {
      type: String,
    },
  },
  { timestamps: true }
  // creating transaction model
);
const Transaction = new mongoose.model("transaction", transactionSchema);
// export transaction model
module.exports = Transaction;
