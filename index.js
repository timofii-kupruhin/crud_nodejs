const express = require("express")
const mongoose = require("mongoose")

const cors = require("cors")
const cookies = require("cookie-parser")
const methodOverride = require("method-override")
const path = require('path')

// sessions 
const { sessionConfig } = require('./helpers/sessions.js')

// enviroment variables
require('dotenv').config()

// error handler 
require("express-async-errors")

// routes 
const mainRouter = require("./routes/main.js")
const newsRouter = require("./routes/news.js")
const usersRouter = require("./routes/users.js")

// midlleware 
const middleware  = require("./utils/middleware.js")

const app = express()
const PORT = process.env.PORT

app.set("view engine", 'ejs')
app.set("views", './views')

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// encoding 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride())

app.use(cors())
app.use(cookies())

app.use( sessionConfig )

// routes 
app.use("/news", newsRouter)
app.use("/users", usersRouter)
app.use("/", mainRouter)

app.use(middleware.errorHandler)

async function main() {
	try {
		middleware.connectMongo()
		console.log("Mongo connected!")

		app.listen(PORT) 
		console.log("Server has been started.. ")
	} catch(err) { 
		return console.log(err)
	}
}

main()

module.exports = {}