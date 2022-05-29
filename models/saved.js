const mongoose = require('mongoose')
const saved = mongoose.Schema({
    userid: String,
    username: String,
    savedlist: [
        {
            movieid: String,
            moviename: String,
            poster_path: String,
            timestamp: String,
        }
    ]
})
mongoose.model("saved", saved);