const express = require("express")
const router = express.Router()

router.route("/signup")
	.get((req, resp) => {
		resp.render("userspage/signup")
	})
	.post( (req, resp) => {
		console.log("user created")
	})

router.route("/signin")
	.get((req, resp) => {
		resp.render("userspage/signin")
	})
	.post( (req, resp) => {
		console.log("user signed in")
	})
module.exports = [router]