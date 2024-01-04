const express = require("express")
const router = express.Router()
// controllers 
const NewsController = require("../controllers/newsController.js")
// middleware
const { isLoggedIn, upload } = require("../utils/middleware")

router.route("/create")
	.get(isLoggedIn, NewsController.getNewsCreationPage)
	.post([isLoggedIn, upload.single("photo")] , NewsController.createArticle)

router.route("/")
	.get(isLoggedIn, NewsController.getNewsPage)

router.route("/:id")
	.get(isLoggedIn, NewsController.getArticlePage)
 
router.route("/:id/update")
	.get(isLoggedIn, NewsController.getUpdateArticlePage)
	.post(isLoggedIn, NewsController.updateArticle) 

router.route("/:id/delete")
	.post(isLoggedIn, NewsController.deleteArticle) 

router.route("/:id/comment")
	.post(isLoggedIn, NewsController.createComment) 

module.exports = [router]
