const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userController.js")
const { isLoggedIn } = require("../utils/middleware")

router.route("/signup", )
	.get(isLoggedIn, UserController.getRegisterPage)
	.post(UserController.registration)

router.route("/signin", )
	.get(isLoggedIn, UserController.getLoginPage)
	.post(UserController.login)

router.route("/logout", ).get(UserController.logout)
router.route("/update", ).post(UserController.update)

router.route("/").get(isLoggedIn, UserController.getUsersPage)

module.exports = [router]