import jwt from "jsonwebtoken"

/**
 * Generates a JWT for the user
 * @param user - the user to generate a jwt for
 * @returns jwt token
 */
export function generateJWT(user: any) {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)

    return jwt.sign({
        email: user.email,
        id: user.id,
        exp: parseInt((expirationDate.getTime() / 1000).toString(), 10),
    }, 'secret')
}

/**
 * Returns the authenticated json which is just email, id, and token
 * @param user - the user to get the auth JSON for
 * @returns - {
 *      id: number,
 *      email: string,
 *      token: string
 * }
 */
export function toAuthJSON(user: any) {
    const token = user.token ? user.token : generateJWT(user)
    return {
        id: user.id,
        email: user.email,
        token: token
    }
}