const mongoose = require("mongoose");
// mongodb connection code
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: "true",
  })
  .then((conn) => {
    console.log(`connection established`);
  })
  .catch((error) => {
    console.log(error);
  });
