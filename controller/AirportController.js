const { validationResult } = require("express-validator");
const airportModel = require("../model/Airport");
exports.addAirport = async (req, res) => {
  try {
    // getting errors from request body
    const errors = validationResult(req);
    // send json response of error if any else do the intending opperation
    if (!errors.isEmpty()) {
      res.status(201).json(errors);
    } else {
      // destructering values from request body
      const { airportName, fuelCapacity, fuelAvailable } = req.body;
      // if fuelAvailable is more than fuelCapacity send a json reponse
      if (Number(fuelAvailable) > Number(fuelCapacity)) {
        return res.status(400).json({
          message: "fuel availabe can not be greater than fuel capacity",
          status: "error",
        });
      }
      // checking if airportName exist before
      const isAirportExist = await airportModel.find({
        airportName: airportName,
      });
      // if airport exist before send a json response that airport exist before
      if (isAirportExist.length > 0) {
        return res.status(400).json({
          message: "Airport name already exist, try different name",
          status: "error",
        });
      }
      // creating airport model object
      const airport = new airportModel(req.body);
      // saving airport details into db
      const newAirportModel = await airport.save();
      // after successfull save of airport details into db, send a success json response else send error response
      if (newAirportModel) {
        return res.status(201).json({
          message: "new airport added successfully",
          status: "ok",
          airport: newAirportModel,
        });
      } else {
        return res.status(400).json({
          message: "something went wrong, try again later",
          status: "error",
        });
      }
    }
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong, try again later",
      status: "error",
    });
  }
};

// function to  fetch airport details
exports.fetchAirports = async (req, res) => {
  try {
    // desctructering values from request parameters
    let { sortBy, offSet, limit } = req.query;

    // convert offset string into number
    let os = Number(offSet);
    // convert limit string into number
    let l = Number(limit);
    // if the sortBy text is firstFetch set the sortBy to id
    if (sortBy === "firstFetch") {
      sortBy = "recent";
    }
    var airports = [];
    // sort the record in asseccending order of airport name
    if (sortBy === "airportNameAsc") {
      airports = await airportModel
        .find()
        .sort({ airportName: 1 })
        .skip(os)
        .limit(l);
    }

    // sort the record accounding to id
    if (sortBy === "id") {
      airports = await airportModel.find().sort({ _id: 1 }).skip(os).limit(l);
    }

    // sort the record in desseccending order of airport name
    if (sortBy === "airportNameDsc") {
      airports = await airportModel
        .find()
        .sort({ airportName: -1 })
        .skip(os)
        .limit(l);
    }
    // sort the record from recent to older
    if (sortBy === "recent") {
      airports = await airportModel
        .find()
        .sort({ createdAt: -1 })
        .skip(os)
        .limit(l);
    }
    // sort the record from older to recent
    if (sortBy === "older") {
      airports = await airportModel
        .find()
        .sort({ createdAt: 1 })
        .skip(os)
        .limit(l);
    }
    // sort the record in asseccending order of fuelCapacity
    if (sortBy === "fuelCapacityAsc") {
      airports = await airportModel
        .find()
        .sort({ fuelCapacity: 1 })
        .skip(os)
        .limit(l);
    }
    // sort the record in desseccending order of fuelCapacity
    if (sortBy === "fuelCapacityDsc") {
      airports = await airportModel
        .find()
        .sort({ fuelCapacity: -1 })
        .skip(os)
        .limit(l);
    }
    // sort the record in asseccending order of fuel availablity
    if (sortBy === "fuelAvlAsc") {
      airports = await airportModel
        .find()
        .sort({ fuelAvailable: 1 })
        .skip(os)
        .limit(l);
    }
    // sort the record in desseccending order of fuel availablity
    if (sortBy === "fuelAvlDsc") {
      airports = await airportModel
        .find()
        .sort({ fuelAvailable: -1 })
        .skip(os)
        .limit(l);
    }

    // get the total number of record in airport model

    const totalRecord = await airportModel.find().count();
    // send airport details in json format else send error message if no record found
    // get all airports
    const allAirports = await airportModel.find();
    const TopFuelAvalableAirports = await airportModel
      .find()
      .sort({ fuelAvailable: -1 });
    const TopFuelCapacityAirports = await airportModel
      .find()
      .sort({ fuelCapacity: -1 });
    if (airports.length > 0) {
      return res.status(200).json({
        message: "airports fetched successfully",
        status: "ok",
        totalRecord: totalRecord,
        airports: airports,
        allAirport: allAirports,
        TopFuelAvalableAirports: TopFuelAvalableAirports,
        TopFuelCapacityAirports: TopFuelCapacityAirports,
        auth: req.auth,
      });
    } else {
      return res.status(404).json({
        message: "No airport found",
        status: "error",
        airports: airports,
        allAirport: [],
        TopFuelAvalableAirports: [],
        TopFuelCapacityAirports: [],
        error: "error",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong, try again later",
      status: "error",
      airports: airports,
      allAirport: [],
      TopFuelAvalableAirports: [],
      TopFuelCapacityAirports: [],
    });
  }
};

// Delete Airport
exports.deleteAirport = async (req, res) => {
  try {
    // destructure airportId from parameter
    const { airportId } = req.params;
    // delete airport from db
    await airportModel.findOneAndDelete({
      _id: airportId,
    });
    // send status code
    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

// Update Airport function

exports.updateAirport = async (req, res) => {
  try {
    // destructure airportId from parameters
    const { airportId } = req.params;
    // getting airport details from request body
    const airportDetails = req.body;
    // destructure fuelCapacity,fuelAvailable from request body
    const { fuelCapacity, fuelAvailable } = req.body;
    // if fuelAvailable is greater than fuelCapacity send the error message
    if (fuelAvailable > fuelCapacity) {
      return res.status(400).json({
        message: "fuel availabe can not more than capacity",
        status: "error",
      });
    }
    // update airport details in db
    const updatedAirport = await airportModel.findOneAndUpdate(
      {
        _id: airportId,
      },
      airportDetails,
      { new: true }
    );
    // if airport updated successfully send the response accordingly else send error message
    if (updatedAirport) {
      return res.status(201).json({
        message: "airport updated successfully",
        status: "ok",
        airport: updatedAirport,
      });
    } else {
      return res.status(400).json({
        message: "something went wrong",
        status: "error",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong, try later",
      status: "error",
    });
  }
};
exports.editAirport = async (req, res) => {
  try {
    // destructure airportId from parameters
    const { airportId } = req.params;
    // getting airport details from request body
    const airportDetails = req.body;
    // destructure fuelCapacity,fuelAvailable from request body
    const { fuelCapacity, fuelAvailable } = req.body;
    // if fuelAvailable is greater than fuelCapacity send the error message
    if (fuelAvailable > fuelCapacity) {
      return res.status(400).json({
        message: "fuel availabe can not more than capacity",
        status: "error",
      });
    }
    // update airport details in db
    const updatedAirport = await airportModel.findOneAndUpdate(
      {
        _id: airportId,
      },
      airportDetails,
      { new: true }
    );
    // if airport updated successfully send the response accordingly else send error message
    if (updatedAirport) {
      return res.status(201).json({
        message: "airport updated successfully",
        status: "ok",
        airport: updatedAirport,
      });
    } else {
      return res.status(400).json({
        message: "something went wrong",
        status: "error",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong, try later",
      status: "error",
    });
  }
};
