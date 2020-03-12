// Since we are using mogoose, we need to require it
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	user_id : mongoose.Schema.Types.ObjectId, 
	username : String ,
	email : String ,
	password : String 
});

module.exports =  mongoose.model('User' , userSchema);