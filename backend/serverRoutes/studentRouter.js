import express from "express";
import User from "../models/User.js";
import EventValidation from "../validation/EventValidation.js";
import { checkRole } from "../middleware/authMiddleware.js";
import passport from "passport";
import Event from "../models/events.js";

const Studentrouter = express.Router()

// @desc Fetchs data of student
// @method Get 
// @access Private
Studentrouter.get('/current', passport.authenticate('jwt', { session: false }), checkRole('student'), (req, res) => {
	try {
		// res.cookie({
		// 	NAME : 'samudra',
		// 	JOB : 'Full Stack dev'
		// })

		User.findOne({ email: req.user.User_Email }).then(result => {
			console.log(result)
			return res.status(200).json(result)
		})
			.catch(err => {
				console.log(err)
				return res.status(404).json(err)
			})

	} catch (error) {
		console.log(error)
	}
})


// @desc student Registeration for an event 
// @method post 
// @access Private
Studentrouter.post('/register-event', passport.authenticate('jwt', { session: false }), checkRole('student'), async (req, res) => {
	const { name, email, eventname, branchname } = req.body
	const { errors, valid, isValid } = EventValidation(req.body)

	try {
		if (!isValid) {
			return res.status(400).json(errors)
		}

		const newRegisteration = {
			name: name,
			email: email,
			eventName: eventname,
			branchName: branchname
		}
		const Existing_User = await User.findOne({ email })
		// console.log(Existing_User)
		if (!Existing_User) {
			return res.status(404).json({
				message: '404 Not found student'
			})
		}

		const Existing_event = await Event.findOne({ title: eventname })
		if (!Existing_event) {
			return res.status(404).json({
				message: 'Event not found'
			})
		}
		// console.log('This is the value of Existing event : ', Existing_event)
		// console.log('This is the value of Existing event : ', Existing_User)

		//*Below line is used to push the event into the registered Students in the Event
		Existing_event.registeredStudents.unshift(Existing_User)
		const Event_details = {
			id: Existing_event._id,
			eventName: Existing_event.title,
			orgname: Existing_event.organiserName,
			desc: Existing_event.description,
			loca: Existing_event.location,
			date: Existing_event.date,
			image: Existing_event.image || ''
		}

		//*Below line is used to push the event into the student registered events
		Existing_User.studentInfo.registeredEvents.push({
			event: Event_details,
		})

		//*Saving Exisitng_event
		Existing_event.save()
			.then(result1 => {
				//*Saving Existing_user
				Existing_User.save()
					.then(result2 => {
						console.log('This is the value os result after saving Exsiting_User : ', result2)
						// res.json(result2)
					})
					.catch(err => {
						console.log('This is the error from saving Exsiting_user : ', err)
					})
				return res.status(201).json(valid)
			})
			.catch(err => {
				console.log('This is the error from saving existing_Event : ', err)
				return res.status(404).json(err)
			})

	} catch (error) {
		console.log(error)
		return res.status(500).json(error)
	}
})


// @desc to display the events registered by the student 
// @method post 
// @access Private
Studentrouter.get('/my-events', passport.authenticate('jwt', { session: false }), checkRole('student'), async (req, res) => {
	try {
		const student = await User.findOne({ email: req.user.User_Email });

		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		const registeredEvents = student.studentInfo.registeredEvents || [];

		return res.status(200).json(registeredEvents);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
});


// @desc to delete the registed event 
// @method delete 
// @access Private
Studentrouter.delete("/cancel-registration/:eventId", passport.authenticate("jwt", { session: false }), checkRole("student"), async (req, res) => {
	const studentEmail = req.user.User_Email;
	const eventId = req.params.eventId;

	try {
		const student = await User.findOne({ email: studentEmail });
		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		// Remove student from event's registeredStudents
		event.registeredStudents = event.registeredStudents.filter(
			(stu) => stu.toString() !== student._id.toString()
		);

		// Remove event from student's registeredEvents
		student.studentInfo.registeredEvents = student.studentInfo.registeredEvents.filter(
			(e) => e.event.id.toString() !== eventId
		);

		await event.save()
			.then(async () => {
				console.log('This is event save');
				await student.save().then(() => {
					console.log('This is the student save');
				}).catch(err => {
					console.log('This is the error from saving the student : ', err);
				})
				return res.status(200).json({ message: "Registration cancelled successfully" });
			}).catch(err => {
				console.log('This is the error from saving the event : ', err);
				return res.status(400).json(err);
			})

	} catch (error) {
		console.error("Error cancelling registration:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}
);


// Update profile logic
Studentrouter.put('/update-profile', passport.authenticate('jwt', { session: false }), checkRole('student'), async (req, res) => {
  const { name, usn, email, image } = req.body;

  try {
    const student = await User.findOne({ email: req.user.User_Email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update main fields
    student.studentInfo.name = name || student.studentInfo.name;
    student.studentInfo.usn = usn || student.studentInfo.usn;
    student.User_Email = email || student.User_Email;
    student.image = image || student.image;

    await student.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default Studentrouter;