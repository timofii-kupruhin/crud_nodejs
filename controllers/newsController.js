const express = require("express")
const mongoose = require("mongoose")
const NewsServices = require("../services/newsServices.js")
const UserServices = require("../services/userServices.js")

class NewsController {
	//  ------------------- POST REQUESTS -------------------
		
	async createArticle (req, resp) { 
		const {title, text} = req.body
		const authorData = await UserServices.getUserById(req.user.user_id)
		
		NewsServices.createArticle(title, text, `${authorData.name} ${authorData.surname}`)
		return resp.redirect(`/news/`)
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

		if ( mongoose.Types.ObjectId.isValid(articleId) ) {
			const data = {
				auth : is_authorized, 
				article: await NewsServices.getOneArticle(articleId)
			}
			return resp.render("newsPage/articlePage", data)
		} else { 
			return resp.redirect("/")
		}
	}
	
	async getNewsPage (req, resp) { 
		const is_authorized = req.user == undefined ? false : true 
		const data = { 
			auth: is_authorized, 
			articles: await NewsServices.getArticles()
		}
		return resp.render("newspage/newspage",  data )
	}
}

module.exports = new NewsController()