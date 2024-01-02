const UserModel = require("../models/usersModels.js")
const ArticleModel = require("../models/articleModel.js")
const mongoose = require('mongoose')

class UserServices { 
	async getUserById (userId) {
		let userData = await UserModel.findById( userId ).lean()
		return userData 
	}
	async getUserName (userId) {
		const userData = await this.getUserById(userId)
		return `${userData.name} ${userData.surname}`
	}
	async updateUserData(userId, data) {
		const userData = this.getUserById(userId)
		const updatedUser = await UserModel.findOneAndUpdate({ _id: userId}, data);
	}

	async updateArticleList (userId, articleId) {
		const userData = await this.getUserById(userId)
		let articleList = userData["articles"]
		articleList.splice(articleList.indexOf(articleId))
		return this.updateUserData(userId, {articles: articleList})
	}
}

module.exports = new UserServices()