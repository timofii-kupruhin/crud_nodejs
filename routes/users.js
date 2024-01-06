const express = require("express")
const router = express.Router()
// controllers
const UserController = require("../controllers/userController.js")
// middleware
const { isLoggedIn, upload } = require("../utils/middleware")

router.route("/signup", )
	.get(isLoggedIn, UserController.getRegisterPage)
	.post(UserController.registration)

router.route("/signin", )
	.get(isLoggedIn, UserController.getLoginPage)
	.post(UserController.login)

router.route("/logout", ).get(UserController.logout)

router.route("/update", )
	.get(isLoggedIn, UserController.getUserUpdatePage)
	.post([isLoggedIn, upload.single("image")], UserController.updateUser)

router.route("/changePassword", )
	.get(isLoggedIn, UserController.getChangePasswordPage)
	.post(isLoggedIn, UserController.changePassword)

router.route("/delete", )
	.post(isLoggedIn, UserController.deleteUser)

router.route("/")
	.get(isLoggedIn, UserController.getUsersPage)

module.exports = [router]