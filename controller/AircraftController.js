const { validationResult } = require("express-validator");
const aircraftModel = require("../model/Aircraft");
const { v4: uuidv4 } = require("uuid");
exports.addAircraft = async (req, res) => {
  // getting validation validation errors
  const errors = validationResult(req);
  // send validation error if any in json format in if bloack else do the rest opperation
  if (!errors.isEmpty()) {
    return res.status(201).json(errors);
  } else {
    // destructing data from request body
    const { aircraftId, aircraftNo, airline } = req.body;
    // checking if arline exist before
    const isAirlineExist = await aircraftModel.findOne({ airline: airline });
    // if airline exist, send a json response that airline is exist before
    if (isAirlineExist) {
      return res.status(201).json({
        message: "Airline already exist, try different Name",
        status: "error",
      });
    }
    // check if airline exist before
    const isAircraftNoExist = await aircraftModel.findOne({
      aircraftNo: aircraftNo,
    });
    // if arline number exist before, send a json response that airline number is exist before
    if (isAircraftNoExist) {
      return res.status(201).json({
        message: "Aircraft Number already exist, try different Number",
        status: "error",
      });
    }
    // creating aircraft object
    const aircraft = new aircraftModel(req.body);
    // save aircraft details into aircraft collection
    const newAircraft = await aircraft.save();
    // getting details of all aircraft exist before
    const allAircraft = await aircraftModel.find();
    // send json response if new aircraft created else send the error message
    if (newAircraft) {
      return res.status(201).json({
        message: "new aircraft created successfully",
        status: "ok",
        aircraft: newAircraft,
        allAircraft: allAircraft,
        user: req.profile,
        user1: req.auth,
      });
    } else {
      return res.status(401).json({
        message: "something went wrong, try again later",
        status: "error",
      });
    }
  }
};

// function for get all aircraft details
exports.fetchAllAircraft = async (req, res) => {
  // destructering values from request parameter
  let { sortBy, offSet, limit } = req.params;
  // converting offset string value into number
  let os = Number(offSet);
  // converting limit string value into number
  let l = Number(limit);
  // if sortBy text is firstFetch set sortBy to id
  if (sortBy === "firstFetch") {
    sortBy = "recent";
  }
  var allAircrafts = [];
  // sort record in assccesnding order if aircraft NUmber
  if (sortBy === "aircraftNoAsc") {
    allAircrafts = await aircraftModel
      .find()
      .sort({ aircraftNo: 1 })
      .skip(os)
      .limit(l);
  }

  // sort record accounding to id
  if (sortBy === "id") {
    allAircrafts = await aircraftModel
      .find()
      .sort({ _id: 1 })
      .skip(os)
      .limit(l);
  }

  // sort record in Desccending order of aircraft NUmber
  if (sortBy === "aircraftNoDsc") {
    allAircrafts = await aircraftModel
      .find()
      .sort({ aircraftNo: -1 })
      .skip(os)
      .limit(l);
  }
  // sort record in from recent to older
  if (sortBy === "recent") {
    allAircrafts = await aircraftModel
      .find()
      .sort({ createdAt: -1 })
      .skip(os)
      .limit(l);
  }
  // sort record from older to recent
  if (sortBy === "older") {
    allAircrafts = await aircraftModel
      .find()
      .sort({ createdAt: 1 })
      .skip(os)
      .limit(l);
  }
  // sort record in assccending  order of  airline name
  if (sortBy === "airlineAsc") {
    allAircrafts = await aircraftModel
      .find()
      .sort({ airline: 1 })
      .skip(os)
      .limit(l);
  }
  // sort record in Descending  order of  airline name
  if (sortBy === "airlineDsc") {
    allAircrafts = await aircraftModel
      .find()
      .sort({ airline: -1 })
      .skip(os)
      .limit(l);
  }
  // getting total record in airvcraft model
  let totalRecord = await aircraftModel.find().count();
  // get all aircraft
  const allAircraft = await aircraftModel.find();
  // send aircraft details in json format else send error message if no aircraft found
  if (allAircrafts.length > 0) {
    return res.status(200).json({
      message: "Aircraft Fetched successfully",
      status: "ok",
      totalRecord: totalRecord,
      user: req.profile,
      aircraft: allAircrafts,
      allAircraft: allAircraft,
    });
  } else {
    return res.status(401).json({
      message: "Aircraft not Found",
      status: "error",
    });
  }
};

// function for get all aircraft for sorting
exports.fetchAllAircraftForSorting = async (req, res) => {
  // get aircraft details from db;
  const aircrats = await aircraftModel.find();
  // send aircraft details in json format else send the error message
  if (aircrats.length > 0) {
    res.status(200).json({
      message: "aircraft fetched successfully",
      status: "ok",
      aircrafts: aircrats,
    });
  } else {
    res.status(200).json({
      message: "somethig went wrong, try later",
      status: "error",
    });
  }
};
