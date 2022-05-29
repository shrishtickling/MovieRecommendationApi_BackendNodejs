const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const POST = mongoose.model("POST");
router.post("/post", async (req, res) => {
  const body = req.body;
  try {
    const post = await new POST(body);
    post.save().then((result) => {

    })
    
    res.json({ post: post });

  } catch (error) {
    res.json({ message: "post unsuccessfull" });
  }

});
router.get("/post", async (req, res) => {

  const post = await POST.find().sort({ "timestamp": -1 })
  res.json({ post: post });

});
router.get("/post/:postid", async (req, res) => {

  const post = await POST.findById(req.params.postid).sort({ "timestamp": -1 })

  res.json({ post: post });

});
router.put("/post/:id", async (req, res) => {
  const _id = req.params.id
  const data = req.body.answers;
  try {

    await POST.findByIdAndUpdate(_id, {
      $push: {
        answers: data
      }
    }).then((result) => res.json({ post: result }));
  } catch (err) {
    res.json({ err: err.message });
  }
});
router.put("/follow/:id", async (req, res) => {
  const _id = req.params.id
  const data = req.body.followers;

  try {
    await POST.findByIdAndUpdate(_id, {
      $push: {
        followers: data
      }
    }).then((result) => res.json({ post: result }));
  } catch (err) {
    res.json({ err: err.message });
  }
});
router.put("/likes/:id", async (req, res) => {
  const _id = req.params.id
  const data = req.body.likes;
  try {
    await POST.findByIdAndUpdate(_id, {
      $push: {
        likes: data
      }
    }).then((result) => res.json({ post: result }));
  } catch (err) {
    res.json({ err: err.message });
  }
});

module.exports = router;
