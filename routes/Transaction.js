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

router.post(
  "/transaction/add",
  [
    check("transactionType", "chose transaction type").notEmpty(),
    check("airportId", "chose airport").notEmpty(),
    check("quantity", "chose quantity").notEmpty(),
  ],
  isSignedIn,
  transactionController.addTransaction
);

router.get(
  "/transaction",
  isSignedIn,
  transactionController.fetchAllTransaction
);
router.delete(
  "/transaction/:transactionId",
  isSignedIn,
  transactionController.deleteTransaction
);

router.put(
  "/transaction/:transactionid",
  isSignedIn,
  transactionController.updateTransaction
);
router.patch(
  "/transaction/:transacTionId",
  isSignedIn,
  transactionController.editTransaction
);

module.exports = router;
