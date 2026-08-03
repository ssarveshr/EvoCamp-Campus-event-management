import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config.js";
import ValidateStudentData from '../validation/StudentValidation.js'
import getRandomLengthNumber from "../Security/GenrandomNumber.js";
import nodemailer from "nodemailer";
const commonsignup = express.Router()

// @desc User sign up (User will select their respective role)
// @method post 
// @access public
commonsignup.post('/signup', async (req, res) => {
	const { errors, isValid } = ValidateStudentData(req.body)
	try {
		if (!isValid) {
			return res.status(400).send(errors)
		}

		const { email, password, role, RoleData } = req.body

		const Exist_user = await User.findOne({ email: email })

		console.log('This is the value of Exist_user : ', Exist_user)

		if (Exist_user) {
			errors.noUser = 'User already Exists'
			return res.status(400).send(errors)
		}

		console.log(`Email : ${email} \n password : ${password} \nrole : ${role} \nRoleData : ${RoleData}\n`)

		// Create user object with correct field names
		const userData = {
			email: email,
			password: await bcrypt.hash(password, 10), // Hash password before saving
			role: role, // lowercase 'role' to match schema
		};

		// Add role-specific data
		if (role === 'student') {
			userData.studentInfo = RoleData;

		} else if (role === 'organizer') {
			userData.organizerInfo = RoleData;
			userData.organizerInfo.Organiser_ID = getRandomLengthNumber(10, 10);
		} else if (role === 'faculty') {
			userData.facultyInfo = RoleData;
			userData.facultyInfo.faculty_ID = getRandomLengthNumber(10, 10);
		}

		const NewUser = await User.create(userData);

		const PayLoad = {
			User_id: NewUser._id,
			User_Email: NewUser.email,
			Role: NewUser.role
		}

		const Token = jwt.sign(PayLoad, JWT_SECRET, { expiresIn: '1h' })

		return res.status(201).send({
			success: true,
			message: 'Sign up successful',
			Token: 'Bearer ' + Token
		})

	} catch (error) {
		console.log(error)
		errors.InternalServerIssue = "Internal Server Error"
		return res.status(500).send(errors);
	}
})

export default commonsignup