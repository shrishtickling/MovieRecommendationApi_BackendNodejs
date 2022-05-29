const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
require("./models/user");
app.use(require("./routes/userroute"));
require("./models/post");
app.use(require("./routes/postroute"));
require("./models/watchlist");
app.use(require("./routes/watchlistroute"));
require("./models/saved");
app.use(require("./routes/savedrouter"));
mongoose
  .connect(
    "MONGODBURL",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .then((res) => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log(Error, err.message);
  });

const port = process.env.PORT || 8088;
app.listen(port, () => {
  console.log("server is runnnig");
});
