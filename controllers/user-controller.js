const userService = require('../services/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../utilities/api-error')

class UserController {
	async signUp(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				throw ApiError.BadRequest('Ошибка при валидации', errors.array())
			}
			const userData = await userService.signUp(req.body)
			res.cookie('token', userData.refreshToken, {
				maxAge: Number(process.env.JWT_REFRESH_COOKIE_EXPIRES),
				httpOnly: true,
				sameSite: 'strict'
			})
			return res.json({token: userData.accessToken})
		} catch (e) {
			next(e)
		}
	}
	async signIn(req, res, next) {
		try {
			const userData = await userService.signIn(req.body)
			res.cookie('token', userData.refreshToken, {
				maxAge: Number(process.env.JWT_REFRESH_COOKIE_EXPIRES),
				httpOnly: true,
				sameSite: 'strict'
			})
			return res.json({token: userData.accessToken})
		} catch (e) {
			next(e)
		}
	}
	async logOut(req, res, next) {
		try {
			const {token} = req.cookies
			await userService.logOut(token)
			res.clearCookie('token')
			return res.json({message: 'Logout success'})
		} catch (e) {
			next(e)
		}
	}
	async refresh(req, res, next) {
		try {
			const {token} = req.cookies
			const userData = await userService.refresh(token)
			res.cookie('token', userData.refreshToken, {
				maxAge: Number(process.env.JWT_REFRESH_COOKIE_EXPIRES),
				httpOnly: true,
				sameSite: 'strict'
			})
			return res.json({token: userData.accessToken})
		} catch (e) {
			next(ApiError.UnauthorizedError())
		}
	}
	async getMe(req, res, next) {
		try {
			const userData = await userService.getMe(req.userId)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new UserController()
