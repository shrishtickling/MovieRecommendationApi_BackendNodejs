const mongoose = require("mongoose");
const user = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isauth: Boolean,
});
mongoose.model("ALLUSERS", user);
