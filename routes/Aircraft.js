const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const aircraftController = require("../controller/AircraftController");
var cookieParser = require("cookie-parser");
const { isSignedIn, getUserById } = require("../middleware/AuthMiddleware");
const Aircraft = require("../model/Aircraft");

const router = express.Router();
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());
router.use(cookieParser());
router.param("userId", getUserById);

router.post(
  "/aircrafts",
  isSignedIn,
  [
    check("aircraftNo", "aircraft Number is mandatory").notEmpty(),
    check("airline", "name shouold be minimum 2 character").isLength({
      min: 2,
    }),
  ],
  aircraftController.addAircraft
);

router.get("/aircrafts", isSignedIn, aircraftController.fetchAllAircraft);

router.delete(
  "/aircrafts/:aircraftId",
  isSignedIn,
  aircraftController.deleteAircraft
);
router.put(
  "/aircrafts/:aircraftId",
  isSignedIn,
  aircraftController.updateAircraft
);
router.patch(
  "/aircrafts/:aircraftId",
  isSignedIn,
  aircraftController.editAircraft
);
module.exports = router;
