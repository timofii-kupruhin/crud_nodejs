const mongoose = require("mongoose")
const Schema = mongoose.Schema
require('mongoose-type-email');

const UserModelSchema = new Schema({
  name: {type:String, required: true},
  surname: {type: String, default: ""},
  password: {type: String, min: 5, max: 15, required: true}, 
  email : {type: mongoose.SchemaTypes.Email, allowBlank: false, required: true},
  date: { type: Date, default: Date.now() },
  articles:  {type: [String], allowBlank: true },
  image: {type: Schema.Types.ObjectId, allowBlank: true, default: null},
  is_admin: { type: Boolean, default: false }
});
 

module.exports = mongoose.model("UserModel", UserModelSchema)