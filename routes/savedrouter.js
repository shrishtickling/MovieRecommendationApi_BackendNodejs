const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const saved = mongoose.model("saved");
router.post("/saved/:userid/:movieid", async (req, res) => {
    const data = req.body;
    try {
        await saved.findOne({ userid: req.params.userid }).then(async (value) => {
            if (value) {
                await saved.findOne({
                    "userid": req.params.userid,
                    "savedlist": {
                        "$elemMatch": {
                            "movieid": req.params.movieid,
                        }
                    }
                }).then(async (result) => {
                    if (result) {
                        await saved.updateMany({
                            "userid": req.params.userid,
                            "savedlist": {
                                "$elemMatch": {
                                    "movieid": req.params.movieid,
                                }
                            },
                        },
                            {
                                $set: {
                                    "savedlist.$[outer].movieid": data.savedlist[0].movieid,
                                    "savedlist.$[outer].moviename": data.savedlist[0].moviename,
                                    "savedlist.$[outer].poster_path": data.savedlist[0].poster_path,
                                }

                            },
                            {

                                arrayFilters: [{ "outer.movieid": req.params.movieid },

                                ], multi: true
                            },
                        ).then(() => {
                            res.json({ message: "success" })

                        })
                    }
                    else {
                        await saved.updateMany({
                            "userid": req.params.userid
                        },
                            {
                                $push: {
                                    savedlist: data.savedlist
                                }
                            }
                        ).then((mes) => {
                            res.json({ post: "success" })
                        })
                    }
                })


            }
            else {
                const d = await new saved(data)
                d.save()
                res.json({ result: d })
            }
        })
    }
    catch (e) {
        res.json(
            {
                "err": e.message
            }
        )
    }


});

router.get("/saved/:userid", async (req, res) => {
    const post = await saved.findOne({ userid: req.params.userid })
    if (post == null) return res.json({ post: [] })
    res.json({ post: post });

});




module.exports = router;
