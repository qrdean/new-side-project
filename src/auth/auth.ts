import jwt from 'express-jwt'

function getTokenFromHeader(req: any) {
  const { headers: { authorization } } = req
  console.log('auth header: ', authorization)

  if (authorization && authorization.split(' ')[0] === 'Token') {
    console.log(authorization.split(' ')[1])
    return authorization.split(' ')[1]
  }

  return null
}

export const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    algorithms: ['HS256'],
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    algorithms: ['HS256'],
    getToken: getTokenFromHeader,
    credentialsRequired: false
  })

}
