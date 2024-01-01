const UserModel = require("../models/usersModels.js")
const mongoose = require('mongoose')

class UserServices { 
	async getUserById (userId) {
		let user_data = await UserModel.findById( userId ).lean()
		return user_data 
	}
	async getUserName (userId) {
		const userData = this.getUserById(userId)
		return userData.name, userData.surname
	}
}

module.exports = new UserServices()