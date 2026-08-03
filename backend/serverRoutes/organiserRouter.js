import express from "express";
import passport from "passport";
import { checkRole } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import EventcreateValidation from "../validation/EventCreateValidation.js";
import Event from "../models/events.js";

const OrganizerRouter = express.Router();

// @desc Fetchs data of Organizer
// @method Get 
// @access Private
OrganizerRouter.get('/current', passport.authenticate('jwt', { session: false }), checkRole('organizer'), (req, res) => {
	User.findOne({ email: req.user.User_Email }).then(result => {
		console.log(result)
		return res.status(200).json(result)
	})
		.catch(err => {
			console.log(err)
			return res.status(404).json(err)
		})
})


// @desc Organizer created events
// @method post 
// @access Private
OrganizerRouter.post('/create-events', passport.authenticate('jwt', { session: false }), checkRole('organizer'), (req, res) => {
	console.log('This is the value of body : ', req.body)
	const { Orgname, title, loca, desc, faculty, imageUrl } = req.body
	const { errors, valid, isValid } = EventcreateValidation(req.body)
	if (!isValid) {
		return res.status(400).json(errors)
	}

	try {
		console.log(req.user.User_Email)

		const email = req.user.User_Email


		const Existing_organiser = User.findOne({ email })

		if (!Existing_organiser) {
			errors.notfound = 'Organiser Not existed please create one'
			return res.status(404).json(errors)
		}
		console.log('This is the value og image : ',imageUrl)

		const NewEvent = {
			organiserName: Orgname,
			title: title,
			description: desc,
			location: loca,
			facultyName: faculty,
			image: imageUrl
		}
		console.log('This is the value of the New Event : ',NewEvent)

		Event.create(NewEvent)
			.then(result => {
				console.log(result)
				return res.status(201).json(result)
			})
			.catch(err => {
				console.log(err)
				return res.status(400).json(err)
			})

	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'Internal server issue'
		})
	}



})

// @desc Gets Number of registed students
// @method get 
// @access Private
OrganizerRouter.get('/registerstudents', passport.authenticate('jwt', { session: false }), checkRole('organizer'), async (req, res) => {
	const { User_id, User_Email, Role } = req.user

	const Existing_user = await User.findOne({ email: User_Email })

	// console.log(Existing_user)

	if (!Existing_user) {
		return res.status(404).json({
			message: 'Organiser not found'
		})
	}
	// console.log('This is the value of user : ', Existing_user)


	const OrgName = Existing_user.organizerInfo.orgname

	const Existing_Event = await Event.findOne({ organiserName: OrgName })

	if (!Existing_Event) {
		return res.status(404).json({
			message: 'Event not found'
		})
	}

	// console.log('This is the value of Event : ', Existing_Event)

	const Registered_students = Existing_Event.registeredStudents
	const Total_registeration = Registered_students.length

	// console.log('This is the Registered_students : ', Registered_students)
	// console.log('This is the Total_registeration : ', Total_registeration)

	if (Total_registeration === 0) {
		return res.status(404).json({
			message: 'No student have registered yet !!!'
		})
	}

	return res.status(200).json({
		TotalRegisteration: Total_registeration,
		RegisteredStudents: Registered_students
	})

})

export default OrganizerRouter;
