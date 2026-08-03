import express from 'express';
import Event from '../../models/events.js';


const Public = express.Router()


// @desc Fetchs all the events available for registration
// @method get 
// @access public
Public.get('/events', (req, res) => {

	Event.find()
		.then((result) => {
			const approved = []
			result.map(item => {
				console.log(item.is_ongoing)
				if (item.is_ongoing === 'true') {
					approved.unshift(item)
				}
			})
			if(approved){
				return res.status(200).json(approved)
			}
			return res.status(204).json({
				message : 'No events found'
			})
		})
		.catch(error => {
			console.log(error)
			return res.status(404).json(error)
		})

})


// @desc Fetchs event by id available for registration
// @method get 
// @access public
Public.get('/events/:id', (req, res) => {
	const id = req.params.id

	Event.findById(id)
		.then((result) => {
			return res.status(200).json(result)
		})
		.catch(error => {
			console.log(error)
			return res.status(404).json(error)
		})
})



export default Public;