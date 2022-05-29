const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("ALLUSERS");
const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken")
const key = "jashwanthbj9"
router.get("/", (req, res) => {
  res.send("Api is running ");
});
router.post("/signup", async (req, res) => {
  const { username, email, password } = await req.body;
  if (!username || !email || !password) {
    return res.json({ message: "Please fill the all details" });
  } else {
    User.findOne({ email: email }).then((saveduser) => {
      if (saveduser) {
        return res.json({ message: "user already exist" });
      } else {
        bcrypt.hash(password, 12).then((hashpassword) => {
          const user = new User({
            username: username,
            email: email,
            password: hashpassword,
            isauth: true
          });
          user.save().then((user) => {
            res.json({
              message: "registered successfully",
              user: user
            });
          });
        });
      }
    });
  }
});
router.post("/signin", async (req, res) => {
  const { email, password } = await req.body;
  if (!email || !password) {
    return res.json({ message: "please enter all details" });
  } else {
    await User.findOne({ email: email }).then((saveduser) => {
      bcrypt
        .compare(password, saveduser.password)
        .then((matched) => {
          if (matched) {

            const { _id, email, username } = saveduser;
            User.findOneAndUpdate({ email: email },
              {
                $push: {
                  isauth: "true",
                }
              })
            return res.json({ message: "sigin successfully", id: _id, username: username, email: email });
          } else {

            return res.json({ message: "Invalid email or password" });
          }
        })
        .catch((error) => res.json({ message: "Invalid email or password" }));
    }).catch((error) => res.json({ message: "Invalid email or password" }));
  }
});
router.get("/signin", async (req, res) => {
  await User.find().then((result) => res.json({ post: result }))

})

module.exports = router;
