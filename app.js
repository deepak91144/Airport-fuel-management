const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
// option data for swagger documentation
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Aiport Fuel Management System API",
      version: "1.0.0",
      description: "Aiport Fuel Management System API",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsdoc(options);
const app = express();

var cors = require("cors");
app.use(cors());
const port = 8000;
require("./model/DnConn");
const userRoutes = require("./routes/User");
const airportRoutes = require("./routes/Airport");
const aircraftRoutes = require("./routes/Aircraft");
const transactionRoutes = require("./routes/Transaction");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/api", userRoutes);
app.use("/api", airportRoutes);
app.use("/api", aircraftRoutes);
app.use("/api", transactionRoutes);
// if any unauthorized person trying to hit any routes this error response is being sent
app.use(function (error, req, res, next) {
  // console.log(error);
  if (error.name === "UnauthorizedError") {
    // console.log(error);
    return res.status(401).json({
      message: error.code,
      status: "error",
    });
  }
});
app.listen(port, () => console.log(`Example app listening on port port!`));
