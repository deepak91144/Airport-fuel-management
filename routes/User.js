const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const userController = require("../controller/UserController");
var cookieParser = require("cookie-parser");
const userModel = require("../model/User");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cookieParser());

router.post(
  "/signup",
  [
    check("name", "name should be minimum 2 character").isLength({ min: 2 }),
    check("email", "invalid email format").isEmail(),
    check("password", "password should be minimum of 6 character").isLength({
      min: 5,
    }),
  ],
  userController.signup
);

router.post(
  "/signin",
  [
    check("email", "invalid email format").isEmail(),
    check("password", "password should be minimum of 6 character").isLength({
      min: 5,
    }),
  ],
  userController.signin
);

router.get("/logout", userController.logOut);

module.exports = router;
