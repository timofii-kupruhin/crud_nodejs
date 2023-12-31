const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const session = require('express-session');
const cookies = require("cookie-parser")

require('dotenv').config()
// routes 
const mainRouter = express.Router()
const newsRouter = require("./routes/news.js")
const usersRouter = require("./routes/users.js")
// models 
const ArticleModel = require("./models/articleModel.js")
const UserModel = require("./models/usersModels.js")

//middleware
const { isLoggedIn } = require("./utils/middleware.js")

const app = express()
const PORT = process.env.PORT

app.set("view engine", 'ejs')
// views
app.set("views", './views')

// encoding 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors());
app.use(cookies())

// routes 
app.use("/news", newsRouter)
app.use("/users", usersRouter)
app.use("/", mainRouter)

mainRouter.get("/", isLoggedIn, async (req, resp) => {
	const is_authorized = req.user == undefined ? false : true 
	let data = {auth: is_authorized}
	if (is_authorized) { 
		const user = await UserModel.findOne( { _id: req.user.user_id } )
		data = {auth: is_authorized, user: user}
	} 
	resp.render("mainpage/mainpage", data)
})

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