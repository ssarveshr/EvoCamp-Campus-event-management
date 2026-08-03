import express from 'express'
import User from '../models/User.js'
import bcrypt from "bcryptjs";
import GeneratBearerToken from '../Security/GeneratBearerToken.js'


const CommonLoginRouter = express.Router()

// @desc User Login
// @method post 
// @access public
CommonLoginRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        await User.findOne({ email: email })
        .then(async (result) => {
            // console.log(await bcrypt.compare(password, result.password))
                // console.log(result.password)
                if (!(await bcrypt.compare(password, result.password))) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
                const payload = {
                    User_id: result.id,
                    User_Email: result.email,
                    Role: result.role
                }
                const token = GeneratBearerToken(payload)
                return res.status(201).json({
                    success: true,
                    message: 'login successful',
                    Token: token
                })

            })
            .catch(error => {
                console.log(error)
                return res.status(400).json({
                    message: 'Error find fetching the user from DB'
                })
            })

    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
})

export default CommonLoginRouter