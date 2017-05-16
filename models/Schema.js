var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/database");

var userSchemaJSON = { nombre:String, password:String };
var user_schema = new Schema(userSchemaJSON);
var User = mongoose.model("User",user_schema);

var msgSchema = {autor:String, texto:String};
var msg_schema = new Schema(msgSchema);
var Msg = mongoose.model("Msg", msg_schema);

module.exports.msg = Msg;
module.exports.user = User;
