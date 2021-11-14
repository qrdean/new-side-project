import express from 'express'
import bcrypt from 'bcryptjs';
import passport from 'passport'

export const userRouter = express.Router()
import { generateJWT, toAuthJSON } from '../auth/authHelper';
import { initialize } from '../config/passport'

let users: any[] = []
initialize(
    passport, 
    (email: any) => users.find(user => user.email === email), 
    (id: any) => users.find(user => user.id === id)
)

userRouter.post('/loginWithPassport', (req, res, next) => {
    return passport.authenticate('local', { session: false },
        (err, passportUser, info) => {
            if(err) {
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

userRouter.post('/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(401).send({ message: 'Login Failed'})
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            // return the user
            // Query the database for the user and return
            res.send({ user: { name: user.name, email: user.email }})
        } else {
            res.status(401).send({ message: 'unauthenticated'})
        }
    } catch {
        res.status(500).send()
    }
})

/**
 * Register route
 */
userRouter.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // Save to db 
        users.push({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.send({ message: 'did the thing'})
    } catch (err) {
        res.status(500).send(err)
    }
})
