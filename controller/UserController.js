const { validationResult } = require("express-validator");
const userModel = require("../model/User");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
var jwt = require("jsonwebtoken");

// function for user signup
exports.signup = async (req, res) => {
  try {
    // getting error form request body
    const errors = validationResult(req);
    // send json reposne if any validation error found
    if (!errors.isEmpty()) {
      return res.status(401).json(errors);
    }
    // destructure data fromn request body
    const { name, email, password } = req.body;
    //   check if email exist before
    const isEmailExist = await userModel.find({ email: email });
    // if the email exist before send the json request else do the intended opperation
    if (isEmailExist.length > 0) {
      return res.status(400).json({
        message: "email exist before",
        status: "error",
      });
    } else {
      // create a hashedpassword from palin password
      const hashedPassword = await bcrypt.hash(password, 10);
      // storing the hashedPassword in request body
      req.body.password = hashedPassword;

      // creating user model object
      const user = new userModel(req.body);
      // saving user data into db
      const newUser = await user.save();
      // after successfull signup of user send a json request else send error message
      if (newUser) {
        newUser.password = undefined;
        const token = jwt.sign({ _id: newUser._id }, "airport");
        res.cookie("airporttoken", token, { expire: new Date() + 9999 });

        res.status(201).json({
          message: "user created succsessfully",
          status: "ok",
          user: newUser,
          token: token,
        });
      } else {
        res.status(400).json({
          message: "something went wrong",
          status: "error",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      status: "error",
    });
  }
};
// function for user signin
exports.signin = async (req, res) => {
  try {
    // getting error form request body
    const errors = validationResult(req);
    // send json reposne if any validation error found else do the intended opperartion
    if (!errors.isEmpty()) {
      return res.status(401).json(errors);
    } else {
      // destructure data fromn request body
      const { email, password } = req.body;
      // check if user exist with the exmail id
      const isCorrectEmail = await userModel.findOne({ email: email });
      // if user exist check if the password match with the same user
      if (isCorrectEmail) {
        const isPasswordMatched = await bcrypt.compare(
          password,
          isCorrectEmail.password
        );
        // if password match do the further opperartion
        if (isPasswordMatched) {
          // create jwt token
          const token = jwt.sign({ _id: isCorrectEmail._id }, "airport");
          // craete cookie for jwt token
          res.cookie("airporttoken", token, { expire: new Date() + 9999 });
          isCorrectEmail.password = undefined;
          // send response of successfull signin else send the error message
          res.status(200).json({
            message: "login successfull",
            token: token,
            status: "ok",
            user: isCorrectEmail,
          });
        } else {
          res.status(404).json({
            message: "Invalid Email  or Password",
            status: "error",
          });
        }
      } else {
        res.status(404).json({
          message: "Invalid Email  or Password",
          status: "error",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "something went wrong, try later",
      status: "error",
    });
  }
};
// function for logout
exports.logOut = (req, res) => {
  try {
    // clearing cookie from client brower
    res.clearCookie("token");
    // sending response of signout
    res.status(200).json({
      message: "signed out successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong,try later",
    });
  }
};
