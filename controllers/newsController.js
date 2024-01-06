const express = require("express")
const mongoose = require("mongoose")
// services
const NewsServices = require("../services/newsServices.js")
const UserServices = require("../services/userServices.js")
const ImageServices = require("../services/imageServices.js")
// models
const UserModel = require("../models/usersModels.js")
const ArticleModel = require("../models/articleModels.js")

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
		return resp.redirect("/news/")
	}

	async createComment (req, resp) {
		const articleId = req.params.id
		// request data
		const {text} = req.body

		const userData = await UserServices.getUserById(req.user.user_id)
		NewsServices.createComment(articleId, userData, text)
		
		return resp.redirect(`/news/${articleId}`)
	}

	async updateArticle (req, resp) {
		const articleId = req.params.id

		const article = NewsServices.getOneArticle(articleId)

		// request data 
		const { title, text, date } = req.body
		const image = req.file

		let data = {
			title: title,
			text: text,
			date: date
		}
		if ( image ) {
			if (article.image != null)
				ImageServices.deleteImage(article.image)
			data['image'] = image.id
		}

		NewsServices.updateArticle(articleId, data)
		return resp.redirect('/users/')
	}
	async deleteArticle (req, resp) {
		const articleId = req.params.id
		const userId = req.user.user_id
		// request data 
		const data = req.body

		const deletedArticle = await NewsServices.getOneArticle(articleId)
		
		NewsServices.deleteOneArticle(articleId)
		UserServices.updateArticleList(userId, articleId)
		ImageServices.deleteImage(deletedArticle.image)

		return resp.redirect('/news/')
	}

	//  ------------------- GET REQUESTS -------------------
	async getNewsCreationPage (req, resp) {
		if ( !(req.isAuthorized) )
			return resp.redirect('/users/signin/') 

		return resp.render("newspage/articleCreationPage", {auth: req.isAuthorized})
	}

	async getArticlePage(req, resp) { 
		const articleId = req.params.id
		let data = { auth: req.isAuthorized }

		if ( mongoose.Types.ObjectId.isValid(articleId) ) { 
			if ( req.isAuthorized ){
				const userId = req.user.user_id
				const userData = await UserServices.getUserById(userId)
				data["userData"] = userData
			}

			const imageSource = await ImageServices.getImage(articleId, true) 
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
		const articles = await NewsServices.getArticles()
		
		const imagesPromises = articles.map(article => ImageServices.getImage(article._id, true ));
		const images = await Promise.all(imagesPromises)
		const articleAndImage = await articles.map((article, index) => [article, images[index]])

		const data = { 
		  auth: req.isAuthorized, 
		  articles: articleAndImage,
		};
		return resp.render("newspage/articlesPage",  data )
	}

	async getUpdateArticlePage (req, resp) { 
		if ( !(req.isAuthorized) )
			return resp.redirect('/news/') 

		const articleId = req.params.id
		
		const article = await NewsServices.getOneArticle(articleId)
		const correctDate = await NewsServices.getCorrectDate(article["date"])

		article["date"] = correctDate
		article["imageSource"] = await ImageServices.getImage(articleId, true )

		const data = { 
			auth: req.isAuthorized, 
			article: article
		}

		return resp.render("newspage/articleUpdatePage",  data )

	}
}

module.exports = new NewsController()