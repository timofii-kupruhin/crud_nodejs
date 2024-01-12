const express = require("express");
const app = require('./app.js')
const mongoose = require("mongoose")

// enviroment variables
require('dotenv').config()

const PORT = process.env.PORT

function connectWithRetry () {	 	
	mongoose.connect(process.env.MONGO_DB_URL)
	  .then(() => {
	    console.log('Mongo connected!');
	    app.listen(PORT, () => {
	      console.log(`Server has been started on PORT ${PORT}...`);
	    });
	  })
	  .catch((err) => {
	    console.error('Error connecting to MongoDB:', err.message)
	    setTimeout(connectWithRetry, 5000)
	  });
}

connectWithRetry()
