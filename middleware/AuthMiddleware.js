const userModel = require("../model/User");
var expressJwt = require("express-jwt");
// checking the Authenticity of jwt token
exports.isSignedIn = expressJwt({
  secret: "airport",
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

// this middleware checks the user exist with a specific userId if the user exist set the user details in to re.profile
exports.getUserById = async (req, res, next, userId) => {
  // getting user by its id
  const user = await userModel.findById(userId);
  // if user exist set its data to req.profile else send user not found  message
  if (user) {
    req.profile = user;
  } else {
    return res.status(401).json({
      message: "unAthurizedUser",
      status: "error",
    });
  }
  next();
};
