const express = require('express');
const app = express();
const mongoose = require('mongoose');
// To parse all data that is coming from the user and the data base
const bodyParser = require('body-parser');
// To include cross origin request
const cors = require('cors');
// To hasha and compare passord in an encrypted method
const bcryptjs = require('bcryptjs');
// Used to store the credentials 
const config = require('./config.json');
// Gets user model
const User = require('./models/users.js');
// Gets product model
const Product = require('./models/products.js');
// Sets the port to output to
const port = 3000;

// Connect to db
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}.mongodb.net/shop?retryWrites=true&w=majority`;
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('DB connected!'))
.catch(err =>{
	console.log(`DBConnectionError: ${err.message}`);
});

//test the connectivity
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('We are connected to mongo db');
});

app.use((req,res,next)=>{
	console.log(`${req.method} request for ${req.url}`);
	// Include this to go to the next middleware
	next();
});

//including body-parser, cors, bcryptjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());

app.get('/', (req, res) => res.send('Your application is working fam!'))

app.get('/allProducts', (req,res)=>{
	res.json(product);

});

// app.get('/products/p=:id', (req,res)=>{
	// const idParam = req.params.id;
// 
	// for (let i = 0; i < product.length; i++){
		// if (idParam.toString() === product[i].id.toString()) {
			// res.json(product[i]);
		// }
	// }
	// 
// });

// Register the users 
app.post('/registerUser' , (req,res) =>{ 
	// If the user inputs an already exsisting user name, then this function will ask the user to enter another name
	User.findOne({username:req.body.username},(err,userResult) =>{
		if(userResult){
			res.send('Username has already been taken :(. Please try entering another username.')
		}
		else{
			const hash = bcryptjs.hashSync(req.body.password);
			const user = new User({
				// Creates a new id for the user dynamically
				_id : new mongoose.Types.ObjectId,
				username : req.body.username,
				email : req.body.email, 
				password : req.body.password
			});
			user.save().then(result =>{
				res.send(result);
			}).catch(err =>res.send(err));
		}
	});
});

// Get all users
app.get('/allUsers' , (req,res) =>{
	// Getting it from the database
	User.find().then(result =>{
		res.send(result);
	});
});

// Login the user
app.post('/loginUser' , (req,res) =>{
	User.findOne({username:req.body.username},(err,userResult) =>{
		if(userResult){
			// If the user has successfully entered their  details
			if(bcryptjs.compareSync(req.body.password, userResult.password)){
				res.send(userResult);
			}
			// If the user incorrectly enters their login details that exsist in the database
			else{
				res.send('not authorized');
			}
		}
		else{
			res.send('User is not found. Please register');
		}
	});
});

// Adding a product
app.post('/addProduct' , (req,res) =>{
	Product.findOne({productName:req.body.productName},(err,productResult) =>{
		if(productResult){
			res.send('There is already an exsisting product by that name')
		}
		else{
			const product = new Product({
				// Creates a new id for products dynamically
				_id : new mongoose.Types.ObjectId,
				productName : req.body.productName,
				quantity : req.body.quantity,
				price : req.body.price
			});
			// Pushes product to database
			product.save().then(result =>{
				res.send(result);
			}).catch(err =>res.send(err));
		}
	});
});

// View products
app.get('/viewProducts' , (req,res) =>{
	Product.find().then(result =>{
		res.send(result);
	});
});

// Delete a product
app.delete('/deleteProduct/:id' , (req,res) =>{ // Do not incoude the colon when deleteing
	const idParam = req.params.id;
	// _id refers to the product id in MongoDB
	Product.findOne({_id : idParam} , (err,product) =>{
		if(product){
			Product.deleteOne({_id:idParam},err =>{
				res.send('Product has been deleted');
			})
		}
		else{
			res.send('Product not found');
		}
	}).catch(err => res.send(err));
});

// Update a product
app.patch('/updateProduct/:id' , (req,res) =>{
	// Stores inputted product ID
	const idParam = req.params.id;
	// Finds the product relating to the inputted id
	Product.findById(idParam , (err,product) =>{
		const updatedProduct = {
			productName : req.body.productName,
			quantity : req.body.quantity,
			price : req.body.price
		};
		Product.updateOne({_id:idParam}, updatedProduct).then(result =>{
			res.send(result);
		}).catch(err =>res.send(err));
	}).catch(err =>res.send('Produc not found'));
});

//keep this always at the bottom so that you can see the errors reported
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
