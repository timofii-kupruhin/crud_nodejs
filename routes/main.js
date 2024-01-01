const express = require("express")
const { isLoggedIn } = require("../utils/middleware.js")

const router = express.Router()

const ArticleModel = require("../models/articleModel.js")
const UserModel = require("../models/usersModels.js")


router.get("/", isLoggedIn, async (req, resp) => {
	const is_authorized = req.user == undefined ? false : true 
	let data = {auth: is_authorized}
	if (is_authorized) { 
		const user = await UserModel.findOne( { _id: req.user.user_id } )
		data = {auth: is_authorized, user: user}
	} 
	return resp.render("mainpage/mainpage", data)
})

module.exports = router