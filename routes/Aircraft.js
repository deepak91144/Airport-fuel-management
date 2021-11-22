/**
 * @swagger
 * components:
 *  schemas:
 *    aircraft:
 *      type : object
 *      required:
 *        - aircraftNo
 *        - airline
 *
 *      properties:
 *
 *        aircraftNo:
 *            type : string
 *            description : the user name
 *        airline:
 *            type : string
 *            description : user email
 *
 *      example:
 *
 *         aircraftNo : 01
 *         airline : kingfisher
 *
 *
 */

/**
 * @swagger
 * tags:
 *    name: aircraft
 *    description: Aircraft API
 */

const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const aircraftController = require("../controller/AircraftController");
var cookieParser = require("cookie-parser");
const { isSignedIn, getUserById } = require("../middleware/AuthMiddleware");

const router = express.Router();
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());
router.use(cookieParser());
router.param("userId", getUserById);

/**
 * @swagger
 * /api/aircraft/add/{userId}:
 *    post:
 *       summary: add a aircraft details
 *       tags: [aircraft]
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
 *                  $ref: '#/components/schemas/aircraft'
 *       responses:
 *          201:
 *             description: aircraft successfully created
 *             content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                    $ref: '#/components/schemas/aircraft'
 *
 *
 */
router.post(
  "/aircraft/add/:userId",
  isSignedIn,
  [
    check("aircraftNo", "aircraft Number is mandatory").notEmpty(),
    check("airline", "name shouold be minimum 2 character").isLength({
      min: 2,
    }),
  ],
  aircraftController.addAircraft
);

/**
 * @swagger
 * /api/aircraft/{sortBy}/{offSet}/{limit}/{userId}:
 *    get:
 *       summary: returns aircraft details
 *       tags: [aircraft]
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
 *                    $ref: '#/components/schemas/aircraft'
 *
 *
 */
router.get(
  "/aircraft/:sortBy/:offSet/:limit/:userId",
  isSignedIn,
  aircraftController.fetchAllAircraft
);

/**
 * @swagger
 * /api/aircraft/{userId}:
 *    get:
 *       summary: returns all aircraft details
 *       tags: [aircraft]
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
 *                    $ref: '#/components/schemas/aircraft'
 *
 *
 */
router.get(
  "/aircraft/forsorting/:userId",
  isSignedIn,
  aircraftController.fetchAllAircraftForSorting
);

module.exports = router;
