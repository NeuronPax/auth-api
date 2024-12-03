const userModel = require('../models/user-model')
const tokenModel = require('../models/token-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ApiError = require('../utilities/api-error')

const generateTokens = async payload => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRES})
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRES})
  await tokenModel.updateOne(payload, {token: refreshToken}, {upsert: true})
  return {accessToken, refreshToken}
}

class UserService {
  async signUp({email, password}) {
    const isUser = await userModel.findOne({email})
    if (isUser) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const user = await userModel.create({email, password: hashPassword})
    const tokens = await generateTokens({userId: user._id})
    return tokens
  }
  async signIn({email, password}) {
    const user = await userModel.findOne({email})
    if (!user) {
      throw ApiError.BadRequest(`Неверный логин или пароль`)
    }
    const isPassword = await bcrypt.compare(password, user.password)
    if (!isPassword) {
      throw ApiError.BadRequest(`Неверный логин или пароль`)
    }    
    const tokens = await generateTokens({userId: user._id})
    return tokens
  }
  async logOut(token) {
    return await tokenModel.deleteOne({token})
  }
  async refresh(token) {
    const {userId} = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const isToken = await tokenModel.findOne({token})
    if (!userId || !isToken) throw ApiError.UnauthorizedError()
    const tokens = await generateTokens({userId})
    return tokens
  }
  async getMe(userId) {
    const user = await userModel.findById(userId, {password: false, __v: false})
    return user
  }
}

module.exports = new UserService()