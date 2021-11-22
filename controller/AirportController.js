const { validationResult } = require("express-validator");
const airportModel = require("../model/Airport");
exports.addAirport = async (req, res) => {
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
      return res.status(401).json({
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
      return res.status(401).json({
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
      return res.status(201).json({
        message: "something went wrong, try again later",
        status: "error",
      });
    }
  }
};

// function to  fetch airport details
exports.fetchAirports = async (req, res) => {
  // desctructering values from request parameters
  let { sortBy, offSet, limit } = req.params;
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
  if (airports.length > 0) {
    return res.status(200).json({
      message: "airports fetched successfully",
      status: "ok",
      totalRecord: totalRecord,
      airports: airports,
      allAirport: allAirports,
    });
  } else {
    return res.status(200).json({
      message: "No airport found",
      status: "error",
    });
  }
};

// function to fetch airport details for sorting
exports.fetchAirportsForSorting = async (req, res) => {
  // getting airport record
  const allAirports = await airportModel.find();
  // send airport details in json reponse else send error message if record not found
  if (allAirports.length > 0) {
    return res.status(200).json({
      message: "fethced successfully",
      airports: allAirports,
      status: "ok",
    });
  } else {
    return res.status(401).json({
      message: "something went wrong, try later",
      status: "error",
    });
  }
};
