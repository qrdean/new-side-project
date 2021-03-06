import express from 'express'
import bcrypt from 'bcryptjs';
import passport from 'passport'

export const userRouter = express.Router()
import { generateJWT, toAuthJSON } from '../auth/authHelper';
import { initialize } from '../config/passport'
import { auth } from '../auth/auth'
import { insertUser, getUserByEmail, getUserById } from '../db/dbPool'

let users: any[] = []
initialize(passport, getUserByEmail, getUserById)

userRouter.post('/loginWithPassport', auth.optional, (req, res, next) => {
    return passport.authenticate('local', { session: false },
        (err, passportUser, info) => {
            if (err) {
                return next(err)
            }

            if (passportUser) {
                const user = passportUser
                user.token = generateJWT(passportUser);
                return res.json({ user: toAuthJSON(user) })
            }

            return res.status(400).send(info)
        })(req, res, next)
})

userRouter.post('/login', auth.optional, async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(401).send({ message: 'Login Failed' })
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            // return the user
            // Query the database for the user and return
            res.send({ user: { name: user.name, email: user.email } })
        } else {
            res.status(401).send({ message: 'unauthenticated' })
        }
    } catch {
        res.status(500).send()
    }
})

/**
 * Register route
 *   @params - email: string
 *   @params - name: string
 *   @params - password: string
 */
userRouter.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // Save to db 
        await insertUser({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.send({ message: 'User Registered' })
    } catch (err) {
        res.status(500).send(err)
    }
})
