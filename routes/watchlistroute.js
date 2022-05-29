const e = require("express");
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const watch = mongoose.model("watchlist");
router.post("/watch", async (req, res) => {
    const data = req.body;
    try {
        watch.findOne({ userid: data.userid }).then(async (value) => {
            if (value) {
                await watch.findOne(
                    {
                        "userid": data.userid,
                        "watchlist": {
                            "$elemMatch": {
                                "watchlistname": data.watchlist[0].watchlistname
                            }

                        }
                    }).then(async (v) => {
                        if (v) {
                            return res.json({ "post": "This watchlist is already there please change the name" })

                        }
                        else {
                            await watch.updateMany({ userid: data.userid }, {
                                $push: {
                                    watchlist: data.watchlist
                                }

                            }).then((re) => res.json({ "post": re }));
                        }

                    })

            }
            else {
                const watchlist = await new watch(data);
                watchlist.save()
                res.json({ result: data })

            }
        })

    } catch (error) {
        res.json({ message: "some error occured" });
    }
})
router.get("/watch/:userid", async (req, res) => {
    const post = await watch.find({ userid: req.params.userid })

    res.json({ post: post });
})
router.get("/watch/:userid/:watchmovienameid", async (req, res) => {
    await watch.find(
        {
            "userid": req.params.userid,
            "watchlist": {
                "$elemMatch": {
                    "_id": req.params.watchmovienameid,
                }
            }
        },
    ).then((result) => {
        var d = [];
        result[0].watchlist.map((i) => {
            if (i._id == req.params.watchmovienameid) {
                d.push(i);
            }
        })
        res.json({ post: d });
    })
})
router.put("/watch/:userid/:watchmovienameid/:id", async (req, res) => {

    const watchlist = req.body.watchlistdata
    await watch.findOne({
        "userid": req.params.userid,
        "watchlist": {
            "$elemMatch": {
                "_id": req.params.watchmovienameid,
                "watchlistdata": {
                    "$elemMatch": {
                        "id": req.params.id

                    }

                }

            }

        }
    }).then(async (value) => {
        if (value) {
            try {

                await watch.updateMany(
                    {
                        "userid": req.params.userid,
                        "watchlist": {
                            "$elemMatch": {
                                "_id": req.params.watchmovienameid,
                                "watchlistdata": {
                                    "$elemMatch": {
                                        "id": req.params.id

                                    }


                                }

                            }

                        }
                    },
                    {
                        $set: {
                            "watchlist.$[outer].watchlistdata.$[inner].id": watchlist[0].id,
                            "watchlist.$[outer].watchlistdata.$[inner].moviename": watchlist[0].moviename,
                            "watchlist.$[outer].watchlistdata.$[inner].poster_path": watchlist[0].poster_path,
                        },

                    },

                    {

                        arrayFilters: [{ "outer._id": req.params.watchmovienameid },
                        { "inner.id": req.params.id }

                        ], multi: true
                    },



                ).then((r) => {
                    res.json({ message: "success" });
                });


            } catch (err) {
                res.json({ err: err.message });
            }

        }
        else {
            try {

                await watch.updateMany(
                    {
                        "userid": req.params.userid,
                        "watchlist": {
                            "$elemMatch": {
                                "_id": req.params.watchmovienameid,

                            }

                        }
                    },
                    {
                        $push: {
                            "watchlist.$[outer].watchlistdata": watchlist,

                        },

                    },

                    {

                        arrayFilters: [{ "outer._id": req.params.watchmovienameid },
                        { "inner.id": req.params.id }

                        ], multi: true
                    },



                ).then((r) => {
                    res.json({ message: "success" });
                });


            } catch (err) {
                res.json({ err: err.message });
            }
        }

    })

})
router.delete("/delete/:userid/:watchlistnameid", async (req, res) => {
    try {
        await watch.updateMany({
            userid: req.params.userid
        },
            {
                $pull: {
                    watchlist: {
                        _id: req.params.watchlistnameid
                    }
                }

            }).then(() => res.json({ message: "success" }))
    }
    catch (err) {
        res.json({ message: err.message })
    }



})
module.exports = router;