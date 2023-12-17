const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ArticleModelSchema = new Schema({
  title: {type:String, max: 200, required: true},
  text: {type: String, min: 1},
  date: { type: Date, default: Date.now() },
  _user_id: Schema.Types.ObjectId,
});
 

module.exports = mongoose.model("ArticleModel", ArticleModelSchema)