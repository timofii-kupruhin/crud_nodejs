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

	async createArticle (title, text, author) { 
		const article = await ArticleModel.create(
		{ 
			title: title, 
			text: text,
			author: author
		})
		await article.save()
	}
	
}
module.exports = new NewsServices()