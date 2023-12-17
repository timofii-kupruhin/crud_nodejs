const express = require("express")
const router = express.Router()
const UserModel = require("../models/usersModels")
const mongoose = require("mongoose")

// sleep func
const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)); 

router.route("/signin")
	.get((req, resp) => {
		resp.render("userspage/signin", {error: false})
	})
	.post( async (req, resp) => {
		const {email, password} = req.body
		const user = await UserModel.findOne({email})
		console.log(user)
		if (!user) {
			return resp.render("userspage/signin", {error: "404"})
		}
		console.log("user logged in")
	})

router.route("/signup")
	.get((req, resp) => {
		resp.render("userspage/signup")
	})
	.post( async (req, resp) => {
		const {name, surname, email, password} = req.body
		const candidate = await UserModel.findOne({email})
		if (candidate) {
			return resp.render("userspage/signin", {error: "400"})
		}
		const user = await UserModel.create({name: name, surname: surname, password: password, email: email})
		await user.save()
		await sleep(2000)
		resp.redirect("/users")
	})
module.exports = [router]