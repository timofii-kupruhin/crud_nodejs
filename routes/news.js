const express = require("express")
const router = express.Router()

router.route("/create")
	.get((req, resp) => {
		resp.render('newspage/newscreate')
	})

router.post("/create", (req, resp) => {
		console.log(req.body)
		// next()
		console.log('1213123')

	})

module.exports = [router]
