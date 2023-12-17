const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const ArticleModel = require("../models/articleModel.js")

// sleep func
const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)); 

router.route("/create")
	.get((req, resp) => {
		resp.render('newspage/newscreate')

	}).post(async (req, resp) => {
		const {title, text} = req.body
		const article = await ArticleModel.create({title: title, text: text})
		await article.save()
		await sleep(2000)

		resp.redirect("/news")
	})

// router.route('/')
// 	.get((req, resp) => {

// 	}).post((req, resp) => {

// 	}).delete((req, resp) => {

// 	})

module.exports = [router]
