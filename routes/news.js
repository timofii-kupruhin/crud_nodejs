const express = require("express")
const router = express.Router()
const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

router.get("/create", (req, resp) => {
	resp.render('newspage/newscreate')
})

router.post("/create", async (req, resp) => {
	console.log(req.body)
	await sleep(2000)
	resp.redirect("/news")
})

module.exports = [router]
