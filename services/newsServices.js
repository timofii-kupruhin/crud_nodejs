const mongoose = require('mongoose')
// models 
const ArticleModel = require("../models/articleModels.js")
// services 
const UserServices = require("../services/userServices.js")

class NewsServices { 
	async getArticles() {
		let articlesData = await ArticleModel.find({})
		return articlesData 
	}
	
	async getUsersArticles(userId) {
		let articlesData = await ArticleModel.find({authorId: `${userId}`})
		return articlesData 
	}

	async getOneArticle(articleId) {
		let articleData = await ArticleModel.findById( articleId ).lean()
		return articleData 
	}

	async createArticle (title, text, authorName, authorId, image) { 
		const article = await ArticleModel.create(
		{ 
			title: title, 
			text: text,
			authorName: authorName,
			authorId: authorId,
			image: image
		})
		const savedArticle = await article.save()
		return savedArticle
	}

	async createComment (articleId, userData, text) { 
		let articleData = await ArticleModel.findById( articleId )
        const newComment = { 
        	text: text, 
        	author: userData._id
        }
      
        if (!articleData.comments)
	      articleData.comments = []

    	articleData.comments.push(newComment)

	    await articleData.save()
	}
	
	async getCommentsData (comments) {
		for ( let comment of comments) {
			let authorId = comment["author"], commentDate = comment["date"]
			comment["author"] = await UserServices.getUserName(authorId)
			comment["date"] = await this.getCorrectDate(commentDate)
		}
		return comments

	}
	async getCorrectDate (date) {
		return date.toISOString().split(/[A-Z]/)[0]
	}
	async updateArticle (articleId, articleData) { 
		const updatedArticle = await ArticleModel.findOneAndUpdate({ _id: articleId}, articleData);
	}

	async deleteOneArticle (articleId) { 
		const deletedArticle = await ArticleModel.deleteOne({ _id: articleId});
		return deletedArticle
	}
	
	async deleteManyArticleByAuthor (userId) { 
		const deletedArticles = await ArticleModel.deleteMany({ authorId: `${userId}`})
		return deletedArticles
	}

}
module.exports = new NewsServices()