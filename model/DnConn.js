const mongoose = require("mongoose");
// mongodb connection code
mongoose
  .connect("mongodb://localhost:27017/airport", {
    useNewUrlParser: "true",
  })
  .then((conn) => {
    console.log(`connection established`);
  })
  .catch((error) => {
    console.log(error);
  });
