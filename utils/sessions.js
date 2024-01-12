// session and session store
const session = require('express-session')
const RedisStore = require("connect-redis").default;
const redis = require("redis")

require('dotenv').config()

const redisClient = redis.createClient({
	url: `${process.env.REDIS_DB_URL}`,
})

redisClient.connect().catch(console.error);

const sessionsStore = new RedisStore ( {
	client: redisClient,
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