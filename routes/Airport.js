const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const airportController = require("../controller/AirportController");
var cookieParser = require("cookie-parser");
const { getUserById, isSignedIn } = require("../middleware/AuthMiddleware");

const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());
router.use(cookieParser());
router.param("userId", getUserById);

router.post(
  "/airport/add",
  [
    check("airportName", "name shouold be minimum 2 character").isLength({
      min: 2,
    }),
    check("fuelCapacity", "fuel capacity should not be empty").notEmpty(),
    check("fuelAvailable", "fuel available field is mandatory").notEmpty(),
  ],
  isSignedIn,
  airportController.addAirport
);

router.get("/airports", isSignedIn, airportController.fetchAirports);

router.delete(
  "/airport/:airportId",
  isSignedIn,
  airportController.deleteAirport
);
router.put("/airport/:airportid", isSignedIn, airportController.updateAirport);
router.patch("/airport/:airportId", isSignedIn, airportController.editAirport);
module.exports = router;
