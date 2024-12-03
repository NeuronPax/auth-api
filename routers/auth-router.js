const router = require('express').Router()
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const apiValidation = require('../utilities/api-validation')

router.post('/signup', apiValidation.userValidation, userController.signUp)
router.post('/signin', userController.signIn)
router.post('/logout', userController.logOut)
router.get('/refresh', userController.refresh)
router.get('/me', authMiddleware, userController.getMe)

module.exports = router