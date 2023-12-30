const express = require("express")
const UserModel = require("../models/usersModels")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
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
	     		maxAge: 60*1000*3600
	      })
	      return resp.redirect("/users/")
	    
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
			resp.json(user);
		}
	}

	async update(req, resp) {

	}

	//  ------------------- GET REQUESTS -------------------
	async getLoginPage(req, resp) { 
		const is_authorized = req.user == undefined ? false : true 

		resp.render("userspage/signin", {auth : is_authorized})
	}
	async getRegisterPage(req, resp) { 
		const is_authorized = req.user == undefined ? false : true 

		resp.render("userspage/signup",  {auth : is_authorized})
	}
	async getUsersPage(req, resp) { 
		const is_authorized = req.user == undefined ? false : true 

		resp.render("userspage/userspage",  {auth : is_authorized})
	}
	async logout (req, resp) {
		await resp.clearCookie("token_auth")
		resp.redirect('/'); resp.end()
	}
	
}

module.exports = new UserController(2)