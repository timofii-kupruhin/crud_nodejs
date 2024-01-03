const express = require("express")
const UserModel = require("../models/usersModels")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// services 
const CommentsServices = require("../services/commentsServices.js")
const UserServices = require("../services/userServices.js")
const NewsServices = require("../services/newsServices.js")

require('dotenv').config()

class UserController { 
	//  ------------------- POST REQUESTS -------------------
	async login(req, resp) {
		const {email, password} = req.body
		const user = await UserModel.findOne( { email } )
	    if (user) {
	   	  const result = await bcrypt.compare(password, user.password);
	    if (result) {
	      const token = await jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});
	      
	      resp.cookie("token_auth", token, { 
	     		httpOnly: true, 
	     		secure: true,
	     		maxAge: 60*1000*60
	      })
	      return resp.redirect(`/users/`)
	    
	    } else {
	      resp.status(400).json({ error: "password doesn't match" });
	    }
	    } else {
	      resp.status(400).json({ error: "User doesn't exist" });
	    }
	}

	async registration(req, resp) {
		let {name, surname, email, password} = req.body
		const candidate = await UserModel.findOne({email})
		if (candidate) {
			resp.status(404).json({ error: 'User already exists !!!' })
		} else {
			password = await bcrypt.hash(password, 10)
		
			const doc = new UserModel({
				name: name, 
				surname: surname, 
				password: password, 
				email: email
			})

			const user = await doc.save()
			resp.redirect('/users/signin/')
		}
	}

	async updateUser(req, resp) {
		const isAuthorized = req.isAuthorized
		const userId = req.user.user_id
		let {name, surname, password} = req.body
		const user = await UserServices.getUserById(userId)

		name = name == "" ? user.name : name 
		surname = surname == "" ? user.surname : surname 

	   	const result = await bcrypt.compare(password, user.password);

		if (result) {
			try { 
				UserServices.updateUserData(userId, {name: name, surname: surname})
				return resp.redirect("/users/") 
			} catch (e) {
				return resp.json(e)
			}
		} else { 
			return resp.json({error: "Password does not match"})
		}
	}
	async changePassword (req, resp) {
		const isAuthorized = req.isAuthorized
		const userId = req.user.user_id
		let {oldPassword, newPassword} = req.body
		const user = await UserServices.getUserById(userId)

	   	const result = await bcrypt.compare(oldPassword, user.password);

		if (result) {
			try { 
				UserServices.updateUserData(userId, {password: await bcrypt.hash(newPassword, 10) })
				return resp.redirect("/users/") 
			} catch (e) {
				return resp.json(e)
			}
		} else { 
			return resp.json({error: "Old password incorrect"})
		}
	}

	async deleteUser(req, resp) {
		const isAuthorized = req.isAuthorized
		const userId = req.user.user_id
		if (isAuthorized) {
			await UserServices.deleteUser(userId)
			await CommentsServices.deleteUserComments(userId)
			await NewsServices.deleteManyArticleByAuthor( userId )
			UserServices.clearCookies(req, resp)
			return resp.redirect("/")
		} else { 
			return resp.redirect("/users/signin")
		}
	}

	//  ------------------- GET REQUESTS -------------------
	async getLoginPage(req, resp) { 
		const isAuthorized = req.isAuthorized
		resp.render("userspage/signin", {auth : isAuthorized})
	}
	async getRegisterPage(req, resp) { 
		const isAuthorized = req.isAuthorized

		resp.render("userspage/signup",  {auth : isAuthorized})
	}

	async getUsersPage(req, resp) { 
		const isAuthorized = req.isAuthorized
		const userId = req.user.user_id
		let data = { auth: isAuthorized }
		if (isAuthorized) {
			const userData = await UserServices.getUserById(userId)
			data["userData"] = userData

			if (userData["articles"].length > 0)
				userData["articles"] = await NewsServices.getUsersArticles(userId)
			userData["date"] = await NewsServices.getCorrectDate(userData["date"])

			return resp.render("userspage/userspage", data )

		} else {
			return resp.redirect("/users/signin")
		}
	}

	async getUserUpdatePage(req, resp) { 
		const isAuthorized = req.isAuthorized
		let userData = undefined
		const data = {
			auth : isAuthorized,
			userData: userData
		}

		if (isAuthorized) {
			data['userData'] = await UserServices.getUserById(req.user.user_id)
			return resp.render("userspage/userUpdatePage", data )
		} else {
			return resp.redirect('/users/signin')
		}
	}

	async getChangePasswordPage(req, resp) { 
		const isAuthorized = req.isAuthorized
		const {newPassword} = req.body
		let userData = undefined
		const data = {
			auth : isAuthorized,
			userData: userData
		}

		if (isAuthorized) {
			return resp.render("userspage/changePasswordPage", data )
		} else {
			return resp.redirect('/users/signin')
		}
	}

	async logout (req, resp) {
		UserServices.clearCookies(req, resp)
		resp.redirect('/')
	}
	
}

module.exports = new UserController()