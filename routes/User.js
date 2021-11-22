/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type : object
 *      required:
 *        - name
 *        - email
 *        - password
 *      properties:
 *        _id:
 *            type : mongoId
 *            description : the auto generated mongo id
 *        name:
 *            type : string
 *            description : the user name
 *        email:
 *            type : string
 *            description : user email
 *        password:
 *            type : string
 *            description : user password
 *      example:
 *
 *         name : deepak
 *         email : deepak@gmail.com
 *         password : wdewfgreg46
 *
 */

/**
 * @swagger
 * tags:
 *    name: user
 *    description: User API
 */

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

/**
 * @swagger
 * /api/signup:
 *    post:
 *       summary: create a user
 *       tags: [user]
 *       requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 *       responses:
 *          201:
 *             description: user successfully created
 *             content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                    $ref: '#/components/schemas/User'
 *
 *
 */
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

/**
 * @swagger
 * /api/signin:
 *    post:
 *       summary: login a user
 *       tags: [user]
 *       requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 *       responses:
 *          201:
 *             description: user successfully created
 *             content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    items:
 *                    $ref: '#/components/schemas/User'
 *
 *
 */
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

/**
 * @swagger
 * /api/logout:
 *    get:
 *       summary: logout an user
 *       tags: [user]
 *
 *       responses:
 *          201:
 *             description: user successfully logged out
 *             content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    items:
 *                    $ref: '#/components/schemas/User'
 *
 *
 */
router.get("/logout", userController.logOut);

module.exports = router;
