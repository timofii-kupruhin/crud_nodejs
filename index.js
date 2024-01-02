const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const session = require('express-session');
const cookies = require("cookie-parser")
const methodOverride = require("method-override")
const multer = require("multer")
// enviroment variables
require('dotenv').config()

// routes 
const mainRouter = require("./routes/main.js")
const newsRouter = require("./routes/news.js")
const usersRouter = require("./routes/users.js")

const app = express()
const PORT = process.env.PORT

app.set("view engine", 'ejs')
app.set("views", './views')

// encoding 
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride())
app.use(express.json())

app.use(cors());
app.use(cookies())

// routes 
app.use("/news", newsRouter)
app.use("/users", usersRouter)
app.use("/", mainRouter)

async function main() {
	try {
		await mongoose.connect(`${process.env.DB_URL}`);
		app.listen(PORT) 
		console.log("Server has been started.. ")
	}
	catch(err) { return console.log(err); }
}

main()

module.exports = {}