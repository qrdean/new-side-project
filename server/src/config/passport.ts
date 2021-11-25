import bcrypt from 'bcryptjs';
const LocalStrategy = require('passport-local').Strategy
import passport, { PassportStatic } from 'passport'

export function initialize(passport: PassportStatic, getUserByEmail: Function, getUserById: Function) {
    const authenticateUser = async (email: string, password: string, done: Function) => {
        const user = await getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: 'Login Failed' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Login Failed' })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
}
