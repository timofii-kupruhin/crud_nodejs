const mongoose = require("mongoose")

const initdb = async () => {
	mongoose.connect(process.env.MONGO_DB_URL)
	  .then(() => {
	    console.log('Mongo connected!');
	  })
}

const teardown = async () => {
    await mongoose.disconnect();
}

module.exports = { initdb, teardown } 