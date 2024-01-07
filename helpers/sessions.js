// session and session store
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)

require('dotenv').config()

sessionsStore = new MongoDBSession ( {
	uri: process.env.DB_URL,
	collection: "sessions"
})

const sessionConfig = session( { 
	secret: `${process.env.SESSION_SECRET}`,
	resave: false,
	saveUninitialized: false,
	store: sessionsStore,
	cookie: { 
 		maxAge: 60*1000*60
    }
} )

module.exports = { sessionConfig }