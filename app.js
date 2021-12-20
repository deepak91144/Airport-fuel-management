const express = require("express");
const app = express();
require("dotenv").config();
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
var cors = require("cors");
app.use(cors());
const port = process.env.PORT || 8000;
require("./model/DnConn");
const userRoutes = require("./routes/User");
const airportRoutes = require("./routes/Airport");
const aircraftRoutes = require("./routes/Aircraft");
const transactionRoutes = require("./routes/Transaction");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api/v1", userRoutes);
app.use("/api/v1", airportRoutes);
app.use("/api/v1", aircraftRoutes);
app.use("/api/v1", transactionRoutes);
// if any unauthorized person trying to hit any routes this error response is being sent
app.use(function (error, req, res, next) {
  if (error.name === "UnauthorizedError") {
    return res.status(401).json({
      message: error.code,
      status: "error",
    });
  }
});
app.listen(port, () => console.log(`Example app listening on port port!`));
