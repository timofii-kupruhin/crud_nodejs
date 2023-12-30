const express = require("express")
const router = express.Router()
const NewsController = require("../controllers/newsController.js")
const { isLoggedIn } = require("../utils/middleware")

router.route("/create")
	.get(isLoggedIn, NewsController.getNewsCreationPage)
	.post(NewsController.createArticle)

router.route("/")
	.get(NewsController.getNewsPage)
  
module.exports = [router]
