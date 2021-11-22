const { validationResult } = require("express-validator");
const transactionModel = require("../model/Transaction");
const airportModel = require("../model/Airport");
exports.addTransaction = async (req, res) => {
  // getting error from request body if any
  const errors = validationResult(req);
  // send json format error message if any else do the intended opperartion
  if (!errors.isEmpty()) {
    let errorObj = [];
    errors.errors.forEach((obj) => {
      errorObj.push(obj.msg);
    });
    console.log(errorObj);
    return res.status(201).json({
      status: "error",
      message: errorObj,
    });
  } else {
    // destructure values from request body;
    const { transactionType, airportId, quantity } = req.body;
    const aircraftId = req.body.aircraftId;
    if (!aircraftId && transactionType === "out") {
      return res.status(401).json({
        message: "aircraft is mandatory",
        status: "error",
      });
    }
    // make aircraftId as null if its a IN type transaction
    if (transactionType === "in") {
      req.body.aircraftId = null;
    }
    // get airport data by its id
    const airportData = await airportModel.findOne({ _id: airportId });
    // check if sum if fuelAvailablity and transaction quantity must not greater than fuelCapacity
    // block for in type transaction
    if (transactionType === "in") {
      // send json resposne if the sum if fuelAvailablity and transaction quantity is greater than fuelCapacity else do the intended opperation
      if (
        Number(quantity) + Number(airportData.fuelAvailable) >
        Number(airportData.fuelCapacity)
      ) {
        return res.status(200).json({
          message: "aiport can not contain fuel beyond its capacity ",
          status: "error",
        });
      } else {
        // increament the fuel availabelity by the transaction quantity
        const dataUpdated = await airportModel.findOneAndUpdate(
          { _id: airportId },
          { $inc: { fuelAvailable: quantity } }
        );
        // send the json resposne if updattion is failed
        if (!dataUpdated) {
          return res.status(200).json({
            message: "something went wrong,",
            status: "error",
          });
        }
      }
    } else {
      // if the transaction quantity exceed the fuel capacity send a json resposne
      if (quantity > airportData.fuelAvailable) {
        return res.status(200).json({
          message: "This much fuel is not availabe in airport",
          status: "error",
        });
      } else {
        // decrease the fuel availablity by transaction quantity in out type transaction
        const isDataUpdated = await airportModel.findOneAndUpdate(
          { _id: airportId },
          { $inc: { fuelAvailable: -quantity } }
        );
        // send json response if updation failed
        if (!isDataUpdated) {
          return res.status(200).json({
            message: "something went wrong,",
            status: "error",
          });
        }
      }
    }

    // send a json response if the quantity  is greater than the fuelavailable

    if (Number(quantity) > Number(airportData.fuelAvailable)) {
      return res.status(401).json({
        message: "Requested Quantity is not Availabe In the Selected Airport",
        status: "error",
      });
    }
    // creating transaction object
    const transaction = new transactionModel(req.body);
    // saving transaction details sinto db
    const newTransaction = await transaction.save();
    // send json response if new transaction created else send error response
    if (newTransaction) {
      return res.status(201).json({
        message: "new transaction added successfully",
        status: "ok",
        user: req.profile,
        transaction: newTransaction,
      });
    } else {
      return res.status(401).json({
        message: "something went wrong, please try again later",
        status: "error",
      });
    }
  }
};
exports.fetchAllTransaction = async (req, res) => {
  // destructure values from request parameter
  let { sortBy, offSet, limit } = req.params;
  // convert offset string to number
  let os = Number(offSet);
  // convert limit string to number
  let l = Number(limit);
  // set sortBy text to  airportNameAsc if the soortBy value is firstFetch
  if (sortBy === "firstFetch") {
    sortBy = "recent";
  }
  var allTransaction = [];
  let totalRecord = 0;
  // getting total record of transaction collection
  totalRecord = await transactionModel.find().count();
  switch (sortBy) {
    case "airportNameAsc":
      allTransaction = await transactionModel
        .find()
        .sort({ airportId: 1 })
        .populate("airportId")
        .populate("aircraftId")
        .skip(os)
        .limit(l);

      break;
    case "airportNameDsc":
      allTransaction = await transactionModel
        .find()
        .sort({ airportId: 1 })
        .populate("airportId")
        .populate("aircraftId")
        .skip(os)
        .limit(l);
      break;
    case "recent":
      allTransaction = await transactionModel
        .find()
        .sort({ createdAt: -1 })
        .populate("airportId")
        .populate("aircraftId")
        .skip(os)
        .limit(l);
      break;
    case "older":
      allTransaction = await transactionModel
        .find()
        .sort({ createdAt: 1 })
        .populate("airportId")
        .populate("aircraftId")
        .skip(os)
        .limit(l);
      break;
    case "quantityAsc":
      allTransaction = await transactionModel
        .find()
        .sort({ quantity: 1 })
        .populate("airportId")
        .populate("aircraftId")
        .skip(os)
        .limit(l);
      break;
    case "quantityDsc":
      allTransaction = await transactionModel
        .find()
        .sort({ quantity: -1 })
        .populate("airportId")
        .populate("aircraftId")
        .skip(os)
        .limit(l);
      break;
    case "in":
      allTransaction = await transactionModel
        .find({ transactionType: "in" })
        .populate("airportId")
        .populate("aircraftId")
        .skip(os)
        .limit(l);
      totalRecord = await transactionModel
        .find({ transactionType: "in" })
        .populate("airportId")
        .populate("aircraftId")
        .count();
      break;
    case "out":
      allTransaction = await transactionModel
        .find({ transactionType: "out" })
        .populate("airportId")
        .populate("aircraftId")
        .skip(os)
        .limit(l);
      totalRecord = await transactionModel
        .find({ transactionType: "out" })
        .populate("airportId")
        .populate("aircraftId")
        .count();

      break;

    default:
      allTransaction = await transactionModel
        .find({ airportId: sortBy })
        .populate("airportId")
        .populate("aircraftId")
        .skip(os)
        .limit(l);
      totalRecord = await transactionModel
        .find({ airportId: sortBy })
        .populate("airportId")
        .populate("aircraftId")
        .count();
  }

  // send json response if the record found else send error message
  if (allTransaction.length > 0) {
    return res.status(200).json({
      message: "All Transaction Fetched successfully",
      status: "ok",
      transactions: allTransaction,
      totalRecord: totalRecord,
    });
  } else {
    return res.status(200).json({
      message: "All Transaction Fetched successfully",
      status: "ok",
      transactions: allTransaction,
    });
  }
};
exports.fetchTransactionForReport = async (req, res) => {
  // destructure values from request parameters
  const { searchTerm } = req.params;
  let transactions = [];
  // get the record the searchTerm is firstFetch
  if (searchTerm === "firstFetch") {
    transactions = await transactionModel
      .find()
      .populate("airportId")
      .populate("aircraftId");
  } else {
    transactions = await transactionModel
      .find({ airportId: searchTerm })
      .populate("airportId")
      .populate("aircraftId");
  }
  // get all transaction details
  const allTransaction = await transactionModel
    .find()
    .populate("airportId")
    .populate("aircraftId");

  // send transaction details in json response else send error message
  if (transactionModel.length > 0) {
    return res.json({
      message: "successfully fetch data",
      status: "ok",
      transactions: transactions,
      allTransactions: allTransaction,
    });
  } else {
    return res.json({
      message: "something went wrong, try later",
      status: "error",
    });
  }
};
