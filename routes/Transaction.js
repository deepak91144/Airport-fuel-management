/**
 * @swagger
 * components:
 *  schemas:
 *    transaction:
 *      type : object
 *      required:
 *        - transactionType
 *        - airportId
 *        - aircraftId
 *        - quantity
 *
 *
 *
 *      properties:
 *
 *        transactionType:
 *            type: string
 *            description: type of transaction
 *        airportId:
 *            type: string
 *            description: airportid
 *        aircraftId:
 *            type: string
 *            description: aircraftId
 *        quantity:
 *            type: string
 *            description: quantity of fuel
 *
 *      example:
 *
 *         transactionType : IN
 *         airportId : dwef436476f778fsd
 *         aircraftId: oefwjojre5465oj65
 *         quantity: 435443
 *
 *
 */

/**
 * @swagger
 * tags:
 *    name: transaction
 *    description: Aransaction API
 */

const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const transactionController = require("../controller/TransactionController");
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
 * /api/transaction/add/{userId}:
 *    post:
 *       summary: add a transaction details
 *       tags: [transaction]
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
 *                  $ref: '#/components/schemas/transaction'
 *       responses:
 *          201:
 *             description: transaction successfully created
 *             content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                    $ref: '#/components/schemas/transaction'
 *
 *
 */
router.post(
  "/transaction/add/:userId",
  [
    check("transactionType", "chose transaction type").notEmpty(),
    check("airportId", "chose airport").notEmpty(),
    check("quantity", "chose quantity").notEmpty(),
  ],
  isSignedIn,
  transactionController.addTransaction
);

/**
 * @swagger
 * /api/transaction/{sortBy}/{offSet}/{limit}/{userId}:
 *    get:
 *       summary: returns transaction details
 *       tags: [transaction]
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
 *             description: the list of transaction details
 *             content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                    $ref: '#/components/schemas/transaction'
 *
 *
 */

router.get(
  "/transaction/:sortBy/:offSet/:limit/:userId",
  isSignedIn,
  transactionController.fetchAllTransaction
);

/**
 * @swagger
 * /api/transaction/for-fuel-consumption-report/{searchTerm}/{userId}:
 *    get:
 *       summary: returns transaction for fuel consumption
 *       tags: [transaction]
 *       parameters:
 *          - in: path
 *            name: searchTerm
 *            schema:
 *              type: string
 *            required: true
 *            description: the search text
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *            description: the userId text
 *       responses:
 *          200:
 *             description: transaction for fuel consumption
 *             content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                    $ref: '#/components/schemas/transaction'
 *
 *
 */
router.get(
  "/transaction/for-fuel-consumption-report/:searchTerm/:userId",
  isSignedIn,
  transactionController.fetchTransactionForReport
);

module.exports = router;
