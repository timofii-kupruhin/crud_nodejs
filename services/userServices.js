const mongoose = require('mongoose')
// models
const UserModel = require("../models/usersModels.js")
const ArticleModel = require("../models/articleModels.js")
const CommentModel = require("../models/commentModels.js")
// services
const CommentsServices = require('../services/commentsServices.js')
const NewsServices = require('../services/newsServices.js')

class UserServices { 
	async getUserById (userId) {
		const userData = await UserModel.findById( userId ).lean()
		return userData 
	}
	async getUserName (userId) {
		const userData = await this.getUserById(userId)
		return `${userData.name} ${userData.surname}`
	}

	async updateUserData(userId, data) {
		const userData = this.getUserById(userId)
		const updatedUser = await UserModel.findOneAndUpdate({ _id: userId}, data);
		const updatedArticleAuthor = await ArticleModel.updateMany({ authorId: userId}, {authorName: `${data.name} ${data.surname}`});
	}

	async deleteUser (userId) {
		const userData = await UserModel.findOneAndDelete( { _id: userId })
		return userData
	}
	
	async endSession (req, resp) { 
		req.session.destroy((err) => {
			if (err) console.log(err)
			resp.redirect("/")
		})
	}

	async updateArticleList (userId, articleId) {
		const userData = await this.getUserById(userId)
		let articleList = userData["articles"]
		articleList.splice(articleList.indexOf(articleId))
		return this.updateUserData(userId, {articles: articleList})
	}

}

module.exports = new UserServices()