const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()

const newsRouter = require("./routes/news.js")
const usersRouter = require("./routes/users.js")

const app = express()
const PORT = 3000 || 8080

app.set("view engine", 'ejs')
// views
app.set("views", './views')
// static files
app.use(express.static("public"))

// encoding 
app.use(express.urlencoded({ extended: false }))
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
let articles_data = [{name: "Test", text: "bla bla"}, {name: "Test", text: "bla bla"}]

app.get("/news", (req, resp) => {
	resp.render("newspage/newspage", {articles: articles_data} )
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

module.exports = []