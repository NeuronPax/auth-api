const {body} = require('express-validator')

const userValidation = [
  body('email', 'Некорректный email').isEmail(),
  body('password', 'Пароль должен состоять минимум из 4 символов').isLength({min: 4})
]

module.exports = {
  userValidation
}