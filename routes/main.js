const express = require("express")
const router = express.Router()
// models 
const ArticleModel = require("../models/articleModels.js")
const UserModel = require("../models/usersModels.js")
// middleware 
const { isLoggedIn } = require("../utils/middleware.js")

router.get("/", isLoggedIn, async (req, resp) => {
	const isAuthorized = req.session.isAuthorized
	let data = { auth: isAuthorized }
	if (isAuthorized) { 
		const userId = req.session.user.user_id
		const user = await UserModel.findOne( { _id: userId } )
		data = {auth: isAuthorized, user: user}
	} 
	return resp.render("mainpage/mainpage", data)
})

module.exports = router