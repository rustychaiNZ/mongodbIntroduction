const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId, 
	productName : String ,
	quantity : Number ,
	price : Number 
});

module.exports =  mongoose.model('Product' , productSchema);