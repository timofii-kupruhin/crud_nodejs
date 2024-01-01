const ArticleModel = require("../models/articleModel.js")
const mongoose = require('mongoose')

class NewsServices { 
	async getArticles() {
		let articles_data = await ArticleModel.find({})
		return articles_data 
	}

	async getOneArticle(articleId) {
		let article_data = await ArticleModel.findById( articleId ).lean()
		return article_data 
	}

	async createArticle (title, text, authorName, authorId) { 
		const article = await ArticleModel.create(
		{ 
			title: title, 
			text: text,
			authorName: authorName,
			authorId: authorId
		})
		const savedArticle = await article.save()
		return savedArticle
	}
	
	async updateArticle (articleId, articleData) { 
		const updatedArticle = await ArticleModel.findOneAndUpdate({ _id: articleId}, articleData);
	}

}
module.exports = new NewsServices()