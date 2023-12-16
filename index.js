const express = require("express")
const bodyParser = require('body-parser');
const newsRouter = require("./routes/news.js")
const usersRouter = require("./routes/users.js")
const multer  = require('multer')
const upload = multer()

const app = express()
const PORT = 3000

app.set("view engine", 'ejs')
app.set("views", './views')

app.use(upload.array()); 
app.use(express.static("public"))
app.use("/news", newsRouter)
app.use("/users", usersRouter)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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

app.listen(PORT, () => {
	console.log("Server has been started.. ")
})

module.exports = []