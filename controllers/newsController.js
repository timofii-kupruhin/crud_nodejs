const express = require("express")
const mongoose = require("mongoose")
const NewsServices = require("../services/newsServices.js")
const UserServices = require("../services/userServices.js")
const UserModel = require("../models/usersModels.js")
const ArticleModel = require("../models/articleModel.js")

class NewsController {
	//  ------------------- POST REQUESTS -------------------
		
	async createArticle (req, resp) { 
		const {title, text} = req.body
		const userId = req.user.user_id
		const authorData = await UserServices.getUserById(userId)
		const user = await UserModel.findOne( { _id: userId } )

		let savedArticle = await NewsServices.createArticle(title, text, `${authorData.name} ${authorData.surname}`, authorData._id)
		user.articles.push(savedArticle._id)
		await user.save()
	}

	//  ------------------- GET REQUESTS -------------------
	async getNewsCreationPage (req, resp) {
		const is_authorized = req.user == undefined ? false : true 
		if (is_authorized) { 
			return resp.render("newspage/newscreate", {auth: is_authorized})
		} else { 
			return resp.redirect('/users/signin/') 
		}
	}

	async getArticlePage(req, resp) { 
		const articleId = req.params.id
		const is_authorized = req.user == undefined ? false : true 
		let data = { auth: is_authorized, }

		if (is_authorized) {
			const userData = await UserServices.getUserById(req.user.user_id)
			data["userData"] = userData
		}

		if ( mongoose.Types.ObjectId.isValid(articleId) ) { 
			data["article"] = await NewsServices.getOneArticle(articleId)
			return resp.render("newsPage/articlePage", data)
		} else { 
			return resp.redirect("/news/")
		}
	}
	
	async getNewsPage (req, resp) { 
		const is_authorized = req.user == undefined ? false : true 
		const articles = await NewsServices.getArticles()
		const data = { 
			auth: is_authorized, 
			articles: articles
		}

		return resp.render("newspage/newspage",  data )
	}

	async getUpdateArticlePage (req, resp) { 
		const articleId = req.params.id
		const is_authorized = req.user == undefined ? false : true 
		const article = await NewsServices.getOneArticle(articleId)
		let correctDate = article["date"].toISOString().split(/[A-Z]/)[0]
		article["date"] = correctDate

		const data = { 
			auth: is_authorized, 
			article: article
		}

		return resp.render("newspage/updatePage",  data )
	}

	//  ------------------- PUT REQUESTS -------------------
	async updateArticle (req, resp) {
		const articleId = req.params.id
		const data = req.body
		const is_authorized = req.user == undefined ? false : true
		if (is_authorized) {
			NewsServices.updateArticle(articleId, data)
			return resp.redirect('/users/')
		} else { 
			return resp.redirect("/news/")
		}
	}
}

module.exports = new NewsController()