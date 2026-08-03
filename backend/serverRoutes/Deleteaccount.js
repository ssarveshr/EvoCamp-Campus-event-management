import express from 'express'
import User from '../models/User.js'
import passport from 'passport';

const DeleteAccount = express.Router()

// @desc Deletes respective User account 
// @method Delete 
// @access private
DeleteAccount.delete('/delectacc', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const email = req.user.User_Email

    await User.findOneAndDelete({ email: email })
        .then(() => {
            console.log('Account deleted succesfully')
            return res.status(200).json({
                message: 'Account deleted succesfully'
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(404).json(err)
        })

})

export default DeleteAccount;