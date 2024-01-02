const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema({
  text: {type: String},
  author: {type: String} ,
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("CommentModel", commentSchema)
