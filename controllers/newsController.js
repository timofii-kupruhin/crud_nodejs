const express = require("express")
const mongoose = require("mongoose")
// services
const NewsServices = require("../services/newsServices.js")
const UserServices = require("../services/userServices.js")
const ImageServices = require("../services/imageServices.js")
// models
const UserModel = require("../models/usersModels.js")
const ArticleModel = require("../models/articleModel.js")

class NewsController {
	//  ------------------- POST REQUESTS -------------------
		
	async createArticle (req, resp) { 
		const userId = req.user.user_id
		// request data 
		const {title, text} = req.body
		const file = req.file

		const user = await UserModel.findOne( { _id: userId } )
		const authorData = await UserServices.getUserById(userId)

		const savedArticle = await NewsServices.createArticle(
			title, 
			text, 
			`${authorData.name} ${authorData.surname}`, 
			authorData._id, 
			file.id
		)
		// pushing an article to user list
		user.articles.push(savedArticle._id) 
		await user.save()
	}

	async createComment (req, resp) {
		const isAuthorized = req.isAuthorized
		const articleId = req.params.id
		// request data
		const {text} = req.body

		const userData = await UserServices.getUserById(req.user.user_id)
		NewsServices.createComment(articleId, userData, text)
		
		return resp.redirect(`/news/${articleId}`)
	}

	async updateArticle (req, resp) {
		const isAuthorized = req.isAuthorized
		const articleId = req.params.id
		// request data 
		const data = req.body

		if (isAuthorized) {
			NewsServices.updateArticle(articleId, data)
			return resp.redirect('/users/')
		} else { 
			return resp.redirect("/news/")
		}
	}
	async deleteArticle (req, resp) {
		const articleId = req.params.id
		const userId = req.user.user_id
		// request data 
		const data = req.body

		const isAuthorized = req.isAuthorized
		if (isAuthorized) {
			const deletedArticle = await NewsServices.getOneArticle(articleId)
			NewsServices.deleteOneArticle(articleId)
			UserServices.updateArticleList(userId, articleId)
			ImageServices.deleteImage(deletedArticle.image)

			return resp.redirect('/news/')

		} else { 
			return resp.redirect("/news/")
		}
	}

	//  ------------------- GET REQUESTS -------------------
	async getNewsCreationPage (req, resp) {
		const isAuthorized = req.isAuthorized
		if (isAuthorized) { 
			return resp.render("newspage/newscreate", {auth: isAuthorized})
		} else { 
			return resp.redirect('/users/signin/') 
		}
	}

	async getArticlePage(req, resp) { 
		const isAuthorized = req.isAuthorized
		const articleId = req.params.id

		let data = { auth: isAuthorized }

		if ( mongoose.Types.ObjectId.isValid(articleId) ) { 
			if (isAuthorized) {
				const userId = req.user.user_id
				const userData = await UserServices.getUserById(userId)
				data["userData"] = userData
			}
			const imageSource = await ImageServices.getImage(articleId, {isArticle: true}) 
			let articleData = await NewsServices.getOneArticle(articleId)
			data["article"] = articleData
			
			if (articleData["comments"])
				data["comments"] = await NewsServices.getCommentsData(articleData["comments"])
		 	
		 	if (imageSource)
				data["imageSource"] = imageSource

			return resp.render("newsPage/articlePage", data)
		} else { 
			return resp.redirect("/news/")
		}
	}
	
	async getNewsPage (req, resp) { 
		const isAuthorized = req.isAuthorized

		const articles = await NewsServices.getArticles()
		
		const imagesPromises = articles.map(article => ImageServices.getImage(article._id, { isArticle: true }));
		const images = await Promise.all(imagesPromises)
		const articleAndImage = await articles.map((article, index) => [article, images[index]])

		const data = { 
		  auth: isAuthorized, 
		  articles: articleAndImage,
		};
		return resp.render("newspage/newspage",  data )
	}

	async getUpdateArticlePage (req, resp) { 
		const articleId = req.params.id
		const isAuthorized = req.isAuthorized

		if (isAuthorized) {
			const article = await NewsServices.getOneArticle(articleId)
			const correctDate = await NewsServices.getCorrectDate(article["date"])

			article["date"] = correctDate

			const data = { 
				auth: isAuthorized, 
				article: article
			}

			return resp.render("newspage/updatePage",  data )
		} else { 
			return resp.redirect("/news/")
		}
	}
}

module.exports = new NewsController()