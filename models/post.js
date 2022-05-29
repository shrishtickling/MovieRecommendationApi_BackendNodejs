const mongoose = require("mongoose")
const post = mongoose.Schema({
      userid: String,
      username: String,
      postdata: String,
      timestamp: String,
      answers: [
            {
                  answer_id: String,
                  answerer_name: String,
                  answer: String,
                  timestamp: String,
            }
      ],
      likes: [
            {
                  likedbyid: String,
                  likedbyname: String,
                  timestamp: String,
            }

      ]

})
mongoose.model("POST", post);