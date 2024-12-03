const ApiError = require('../utilities/api-error')
const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(' ')[1]
    const {userId} = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
    req.userId = userId
    next()
  } catch (e) {
    next(ApiError.UnauthorizedError())
  }
}