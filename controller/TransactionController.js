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

    return res.status(201).json({
      status: "error",
      message: errorObj,
    });
  } else {
    // destructure values from request body;
    const { transactionType, airportId, quantity } = req.body;
    const aircraftId = req.body.aircraftId;
    if (!aircraftId && transactionType === "out") {
      return res.status(404).json({
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
        return res.status(400).json({
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
          return res.status(400).json({
            message: "something went wrong,",
            status: "error",
          });
        }
      }
    } else {
      // if the transaction quantity exceed the fuel capacity send a json resposne
      if (quantity > airportData.fuelAvailable) {
        return res.status(400).json({
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
          return res.status(400).json({
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
  try {
    // destructure values from request parameter
    let { sortBy, offSet, limit } = req.query;
    // convert offset string to number
    let os = Number(offSet);
    // convert limit string to number
    let l = Number(limit);
    // set sortBy text to  airportNameAsc if the soortBy value is firstFetch
    if (sortBy === "firstFetch") {
      sortBy = "recent";
    }
    var transactions = [];
    let totalRecord = 0;
    // getting total record of transaction collection
    totalRecord = await transactionModel.find().count();
    switch (sortBy) {
      case "airportNameAsc":
        transactions = await transactionModel
          .find()
          .sort({ airportId: 1 })
          .populate("airportId")
          .populate("aircraftId")
          .skip(os)
          .limit(l);

        break;
      case "airportNameDsc":
        transactions = await transactionModel
          .find()
          .sort({ airportId: 1 })
          .populate("airportId")
          .populate("aircraftId")
          .skip(os)
          .limit(l);
        break;
      case "recent":
        transactions = await transactionModel
          .find()
          .sort({ createdAt: -1 })
          .populate("airportId")
          .populate("aircraftId")
          .skip(os)
          .limit(l);
        break;
      case "older":
        transactions = await transactionModel
          .find()
          .sort({ createdAt: 1 })
          .populate("airportId")
          .populate("aircraftId")
          .skip(os)
          .limit(l);
        break;
      case "quantityAsc":
        transactions = await transactionModel
          .find()
          .sort({ quantity: 1 })
          .populate("airportId")
          .populate("aircraftId")
          .skip(os)
          .limit(l);
        break;
      case "quantityDsc":
        transactions = await transactionModel
          .find()
          .sort({ quantity: -1 })
          .populate("airportId")
          .populate("aircraftId")
          .skip(os)
          .limit(l);
        break;
      case "in":
        transactions = await transactionModel
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
        transactions = await transactionModel
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
        transactions = await transactionModel
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

    let allTransactions = [];
    allTransactions = await transactionModel
      .find()
      .sort({ createdAt: -1 })
      .populate("airportId")
      .populate("aircraftId");
    // send json response if the record found else send error message
    if (transactions.length > 0) {
      return res.status(200).json({
        message: "All Transaction Fetched successfully",
        status: "ok",
        transactions: transactions,
        allTransactions: allTransactions,
        totalRecord: totalRecord,
      });
    } else {
      return res.status(404).json({
        message: "transaction not found",
        status: "error",
        transactions: [],
        allTransactions: [],
        totalRecord: 0,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong, try later",
      status: "error",
      transactions: [],
      allTransactions: [],
    });
  }
};

// delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    // destructure transactionId from request parameters
    const { transactionId } = req.params;
    // delete trandsaction from db;
    const deletedTransaction = await transactionModel.findOneAndDelete({
      _id: transactionId,
    });
    // send status code if transaction deleted successfully else send error message
    if (deletedTransaction) {
      return res.status(204).json({});
    } else {
      return res.status(400).json({
        status: "error",
        message: "something went wrong",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    // destructure transactionId  from request parameter
    const { transactionId } = req.params;
    // getting transaction details from request body
    const transactionDetails = req.body;
    // make aircraftId as null if it is a in type transaction
    if (req.body.transactionType === "in") {
      req.body.aircraftId = null;
    }
    // update the transaction in db
    const updatedTransaction = await transactionModel.findOneAndUpdate(
      { _id: transactionId },
      transactionDetails,
      { new: true }
    );
    // send success message if the transaction updated successfuly else send error resposne
    if (updatedTransaction) {
      return res.status(201).json({
        message: "transaction updated successfully",
        status: "ok",
        updatedTransaction: updatedTransaction,
      });
    } else {
      return res.status(201).json({
        message: "something went wrong",
        status: "error",
      });
    }
  } catch (error) {
    return res.status(201).json({
      message: "something went wrong",
      status: "error",
    });
  }
};
exports.editTransaction = async (req, res) => {
  try {
    // destructure transactionId  from request parameter
    const { transactionId } = req.params;
    // getting transaction details from request body
    const transactionDetails = req.body;
    // make aircraftId as null if it is a in type transaction
    if (req.body.transactionType === "in") {
      req.body.aircraftId = null;
    }
    // update the transaction in db
    const updatedTransaction = await transactionModel.findOneAndUpdate(
      { _id: transactionId },
      transactionDetails,
      { new: true }
    );
    // send success message if the transaction updated successfuly else send error resposne
    if (updatedTransaction) {
      return res.status(201).json({
        message: "transaction updated successfully",
        status: "ok",
        updatedTransaction: updatedTransaction,
      });
    } else {
      return res.status(201).json({
        message: "something went wrong",
        status: "error",
      });
    }
  } catch (error) {
    return res.status(201).json({
      message: "something went wrong",
      status: "error",
    });
  }
};
