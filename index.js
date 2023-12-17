const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()
// routes 
const newsRouter = require("./routes/news.js")
const usersRouter = require("./routes/users.js")
// models 
const ArticleModel = require("./models/articleModel.js")

const app = express()
const PORT = process.env.PORT

app.set("view engine", 'ejs')
// views
app.set("views", './views')
// static files
app.use(express.static("public"))

// encoding 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// routes 
app.use("/news", newsRouter)
app.use("/users", usersRouter)

app.get("/" ,(req, resp) => {
	resp.render("mainpage/mainpage")
})

app.get("/users", (req, resp) => {
	resp.render("userspage/userspage")
})


app.get("/news", async (req, resp) => {
	async function get_articles_data() {
		let articles_data = await ArticleModel.find({})
		return articles_data
	}
	resp.render("newspage/newspage", {articles: await get_articles_data()} )
})

async function main() {
	try {
		await mongoose.connect(`mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@nodemongo.e9qyvvb.mongodb.net/?retryWrites=true&w=majority`);
		app.listen(PORT) 
		console.log("Server has been started.. ")
	}
	catch(err) { return console.log(err); }
}

main()

module.exports = {}