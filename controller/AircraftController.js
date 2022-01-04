const { validationResult } = require("express-validator");
const aircraftModel = require("../model/Aircraft");
const { v4: uuidv4 } = require("uuid");
exports.addAircraft = async (req, res) => {
  try {
    // getting validation validation errors
    const errors = validationResult(req);
    // send validation error if any in json format in if bloack else do the rest opperation
    if (!errors.isEmpty()) {
      return res.status(201).json(errors);
    } else {
      // destructing data from request body
      const { aircraftId, aircraftNo, airline } = req.body;

      // check if airline number exist before
      const isAircraftNoExist = await aircraftModel.findOne({
        aircraftNo: aircraftNo,
      });
      // if arline number exist before, send a json response that airline number is exist before
      if (isAircraftNoExist) {
        return res.status(400).json({
          message: "Aircraft Number already exist, try different Number",
          status: "error",
        });
      }
      // creating aircraft object
      const aircraft = new aircraftModel(req.body);
      // save aircraft details into aircraft collection
      const newAircraft = await aircraft.save();

      // send json response if new aircraft created else send the error message
      if (newAircraft) {
        return res.status(201).json({
          message: "new aircraft created successfully",
          status: "ok",
          aircraft: newAircraft,
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

// function for get all aircraft details
exports.fetchAllAircraft = async (req, res) => {
  try {
    // destructering values from request parameter
    let { sortBy, offSet, limit } = req.query;
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
    let allAircraft = [];
    allAircraft = await aircraftModel.find();
    // send aircraft details in json format else send error message if no aircraft found
    if (allAircrafts.length > 0) {
      return res.status(200).json({
        message: "Aircraft Fetched successfully",
        status: "ok",
        totalRecord: totalRecord,
        aircraft: allAircrafts,
        allAircraft: allAircraft,
      });
    } else {
      return res.status(404).json({
        message: "Aircraft not Found",
        status: "error",
        aircraft: allAircrafts,
        allAircraft: allAircraft,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong, try later",
      status: "error",
      aircraft: allAircrafts,
      allAircraft: allAircraft,
    });
  }
};

exports.deleteAircraft = async (req, res) => {
  try {
    // destructure aircraftId from request parameter
    const { aircraftId } = req.params;
    // delete aircraft from db
    const deletedAircraft = await aircraftModel.findOneAndDelete({
      _id: aircraftId,
    });
    // send the response status code
    return res.status(204).json({});
  } catch (error) {
    return res.status(400).json({});
  }
};

// update aircraft

exports.updateAircraft = async (req, res) => {
  try {
    // destructure aircraftId from request parameters
    const { aircraftId } = req.params;
    // getting aircraft details from request body
    const aircraftData = req.body;

    // check if airline number exist before
    const isAircraftNoExist = await aircraftModel.findOne({
      aircraftNo: aircraftData.aircraftNo,
    });
    // if arline number exist before, send a json response that airline number is exist before
    if (isAircraftNoExist) {
      return res.status(400).json({
        message: "Aircraft Number already exist, try different Number",
        status: "error",
      });
    }
    // update the aircraft in db
    const updatedAircraft = await aircraftModel.findOneAndUpdate(
      { _id: aircraftId },
      aircraftData,
      { new: true }
    );
    // send success response  if the aircraft updated successfully else send error response
    if (updatedAircraft) {
      return res.status(201).json({
        message: "aircrat updated successfully",
        status: "ok",
        updatedAircraft: updatedAircraft,
      });
    } else {
      return res.status(400).json({
        message: "something went wrong",
        status: "error",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      status: "error",
    });
  }
};
exports.editAircraft = async () => {
  try {
    // destructure aircraftId from request parameters
    const { aircraftId } = req.params;
    // getting aircraft details from request body
    const aircraftData = req.body;

    // check if airline number exist before
    const isAircraftNoExist = await aircraftModel.findOne({
      aircraftNo: aircraftData.aircraftNo,
    });
    // if arline number exist before, send a json response that airline number is exist before
    if (isAircraftNoExist) {
      return res.status(400).json({
        message: "Aircraft Number already exist, try different Number",
        status: "error",
      });
    }
    // update the aircraft in db
    const updatedAircraft = await aircraftModel.findOneAndUpdate(
      { _id: aircraftId },
      aircraftData,
      { new: true }
    );
    // send success response  if the aircraft updated successfully else send error response
    if (updatedAircraft) {
      return res.status(201).json({
        message: "aircrat updated successfully",
        status: "ok",
        updatedAircraft: updatedAircraft,
      });
    } else {
      return res.status(400).json({
        message: "something went wrong",
        status: "error",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      status: "error",
    });
  }
};
