const mongoose = require("mongoose")
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer;

const initdb = async () => {

	mongoServer = await MongoMemoryServer.create({
		autoStart: true,
	    instance: {
	      dbName: 'test',
	      port: 27070,     
	    }
	})
    const mongoUri = mongoServer.getUri();
	await mongoose.connect(mongoUri)
}

const teardown = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}

module.exports = { initdb, teardown } 