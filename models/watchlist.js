const mongoose = require('mongoose')
const watchlist = mongoose.Schema({
    userid: String,
    username: String,
    watchlist: [
        {
            watchlistname: String,
            timestamp: String,
            watchlistdata: [
                {

                    id: String,
                    moviename: String,
                    poster_path: String
                }
            ]
        }
    ]
})
mongoose.model("watchlist", watchlist);