const express = require("express")
const mongoose = require("mongoose")
const ArticleModel = require("../models/articleModel.js")

class NewsController {
	//  ------------------- POST REQUESTS -------------------
		
	async createArticle (req, resp) { 
		const {title, text} = req.body
		const article = await ArticleModel.create({title: title, text: text})
		await article.save()
		resp.redirect("/news")
	}

	//  ------------------- GET REQUESTS -------------------
	async getNewsCreationPage (req, resp) {
		const is_authorized = req.user == undefined ? false : true 
		if (is_authorized) { 
			resp.render("newspage/newscreate", {auth: is_authorized})
		} else { 
			resp.redirect('/users/signin/') 
		}
	}
	async getNewsPage (req, resp) { 
		const is_authorized = req.user == undefined ? false : true 

		async function get_articles_data() {
			let articles_data = await ArticleModel.find({})
			return articles_data
		}
		resp.render("newspage/newspage", { auth: is_authorized, articles: await get_articles_data(),} )
	}
}

module.exports = new NewsController()