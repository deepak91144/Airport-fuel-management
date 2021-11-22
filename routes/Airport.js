/**
 * @swagger
 * components:
 *  schemas:
 *    airport:
 *      type : object
 *      required:
 *        - airportName
 *        - fuelCapacity
 *        - fuelAvailable
 *      properties:
 *        airportName:
 *            type : string
 *            description : the airport name
 *        fuelCapacity:
 *            type : string
 *            description : fuel capacity for airport
 *        fuelAvailable:
 *            type : string
 *            description : fuel available for airport
 *      example:
 *
 *         airportName : indira gandhi airport
 *         fuelCapacity : 500000
 *         fuelAvailable : 5699
 *
 */
/**
 * @swagger
 * tags:
 *    name: airport
 *    description: Aiport API
 */
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

/**
 * @swagger
 * /api/airport/add/{userId}:
 *    post:
 *       summary: add a airport details
 *       tags: [airport]
 *       parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *            description: the userId
 *       requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/airport'
 *       responses:
 *          201:
 *             description: user successfully created
 *             content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                    $ref: '#/components/schemas/airport'
 *
 *
 */
router.post(
  "/airport/add/:userId",
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
/**
 * @swagger
 * /api/airports/{sortBy}/{offSet}/{limit}/{userId}:
 *    get:
 *       summary: returns airport details
 *       tags: [airport]
 *       parameters:
 *          - in: path
 *            name: sortBy
 *            schema:
 *              type: string
 *            required: true
 *            description: the sortBy text
 *          - in: path
 *            name: offSet
 *            schema:
 *              type: string
 *            required: true
 *            description: the offSet text
 *          - in: path
 *            name: limit
 *            schema:
 *              type: string
 *            required: true
 *            description: the limit text
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *            description: the userId text
 *       responses:
 *          200:
 *             description: the list of the books
 *             content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                    $ref: '#/components/schemas/airport'
 *
 *
 */
router.get(
  "/airports/:sortBy/:offSet/:limit/:userId",
  isSignedIn,
  airportController.fetchAirports
);

/**
 * @swagger
 * /api/airports/{userId}:
 *    get:
 *       summary: returns all airport details
 *       tags: [airport]
 *       parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *            description: the userId text
 *       responses:
 *          200:
 *             description: the list of the books
 *             content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                    $ref: '#/components/schemas/airport'
 *
 *
 */
router.get(
  "/airports/forsorting/:userId",
  isSignedIn,
  airportController.fetchAirportsForSorting
);
module.exports = router;
